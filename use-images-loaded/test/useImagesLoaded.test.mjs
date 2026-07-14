import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { after, before, test } from 'node:test'
import { JSDOM } from 'jsdom'

const require = createRequire(import.meta.url)
const React = require('react')
const ReactDOM = require('react-dom')
const TestUtils = require('react-dom/test-utils')
const Server = require('react-dom/server')
const { useImagesLoaded } = require('../index.js')
const act = React.act || TestUtils.act
const createRoot = Number.parseInt(React.version, 10) >= 18
  ? require('react-dom/client').createRoot
  : null
const { renderToString } = Server

let dom
const configuredImages = new WeakSet()

before(() => {
  dom = new JSDOM('<!doctype html><html><body></body></html>')
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Event: dom.window.Event,
    IS_REACT_ACT_ENVIRONMENT: true,
  })
})

after(() => dom.window.close())

const setupImage = ({ complete = false, decode = () => Promise.resolve(), inspect } = {}) =>
  (node) => {
    if (!node || configuredImages.has(node)) return
    configuredImages.add(node)
    Object.defineProperty(node, 'complete', { configurable: true, value: complete })
    node.decode = decode
    inspect?.(node)
  }

const Gallery = ({ images = [], containerKey }) => {
  const [ref, loaded] = useImagesLoaded()

  return React.createElement(
    'div',
    { ref, key: containerKey, 'data-loaded': loaded },
    images.map((props, index) => React.createElement('img', { key: index, ref: setupImage(props), alt: '' })),
  )
}

const renderGallery = async (props) => {
  const host = document.body.appendChild(document.createElement('div'))
  const root = createRoot?.(host)
  const render = async (nextProps) =>
    act(async () => {
      const gallery = React.createElement(Gallery, nextProps)
      root ? root.render(gallery) : ReactDOM.render(gallery, host)
    })

  await render(props)

  return {
    host,
    loaded: () => host.firstElementChild?.getAttribute('data-loaded') === 'true',
    image: (index = 0) => host.querySelectorAll('img')[index],
    render,
    unmount: async () => {
      await act(async () => root ? root.unmount() : ReactDOM.unmountComponentAtNode(host))
      host.remove()
    },
  }
}

test('renders false during SSR', () => {
  assert.match(renderToString(React.createElement(Gallery)), /data-loaded="false"/)
})

test('settles empty and complete image snapshots', async (t) => {
  await t.test('empty container', async () => {
    const view = await renderGallery()
    assert.equal(view.loaded(), true)
    await view.unmount()
  })

  await t.test('complete image waits for decode', async () => {
    let finishDecode
    const view = await renderGallery({
      images: [{ complete: true, decode: () => new Promise((resolve) => (finishDecode = resolve)) }],
    })

    assert.equal(view.loaded(), false)
    await act(async () => finishDecode())
    assert.equal(view.loaded(), true)
    await view.unmount()
  })

  await t.test('decode rejection still settles', async () => {
    const view = await renderGallery({
      images: [{ complete: true, decode: () => Promise.reject(new Error('decode failed')) }],
    })
    assert.equal(view.loaded(), true)
    await view.unmount()
  })
})

test('settles pending images on load or error', async (t) => {
  await t.test('load waits for decode', async () => {
    let finishDecode
    const view = await renderGallery({
      images: [{ decode: () => new Promise((resolve) => (finishDecode = resolve)) }],
    })

    assert.equal(view.loaded(), false)
    await act(async () => view.image().dispatchEvent(new Event('load')))
    assert.equal(view.loaded(), false)
    await act(async () => finishDecode())
    assert.equal(view.loaded(), true)
    await view.unmount()
  })

  await t.test('error does not block forever', async () => {
    const view = await renderGallery({ images: [{}] })
    await act(async () => view.image().dispatchEvent(new Event('error')))
    assert.equal(view.loaded(), true)
    await view.unmount()
  })

  await t.test('mixed completion waits for the pending image', async () => {
    const view = await renderGallery({ images: [{ complete: true }, {}] })
    assert.equal(view.loaded(), false)
    await act(async () => view.image(1).dispatchEvent(new Event('load')))
    assert.equal(view.loaded(), true)
    await view.unmount()
  })
})

test('cleans up exact listeners and ignores late completion', async () => {
  const added = []
  const removed = []
  let finishDecode
  const view = await renderGallery({
    images: [
      {
        decode: () => new Promise((resolve) => (finishDecode = resolve)),
        inspect: (image) => {
          const add = image.addEventListener.bind(image)
          const remove = image.removeEventListener.bind(image)
          image.addEventListener = (type, listener, options) => {
            if (type === 'load' || type === 'error') added.push([type, listener])
            add(type, listener, options)
          }
          image.removeEventListener = (type, listener, options) => {
            if (type === 'load' || type === 'error') removed.push([type, listener])
            remove(type, listener, options)
          }
        },
      },
    ],
  })

  assert.equal(added.length, 2)
  await act(async () => view.image().dispatchEvent(new Event('load')))
  await view.unmount()
  finishDecode()
  await Promise.resolve()

  for (const [type, listener] of added) {
    assert.ok(removed.some(([removedType, removedListener]) => removedType === type && removedListener === listener))
  }
})

test('resets for a replacement container but ignores later children', async () => {
  const view = await renderGallery({ containerKey: 'first' })
  assert.equal(view.loaded(), true)

  await view.render({ containerKey: 'second', images: [{}] })
  assert.equal(view.loaded(), false)
  await act(async () => view.image().dispatchEvent(new Event('load')))
  assert.equal(view.loaded(), true)

  await view.render({ containerKey: 'second', images: [{}, {}] })
  assert.equal(view.loaded(), true)
  await view.unmount()
})
