import { useCallback, useEffect, useState } from 'react'

const useImagesLoaded = () => {
  const [container, setContainer] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const ref = useCallback((node) => {
    if (node) setLoaded(false)
    setContainer(node)
  }, [])

  useEffect(() => {
    if (!container) return

    let active = true
    const cleanups = []
    const settle = (image) => {
      const decode = () =>
        typeof image.decode === 'function'
          ? Promise.resolve().then(() => image.decode()).catch(() => {})
          : Promise.resolve()

      if (image.complete) return decode()

      return new Promise((resolve) => {
        const cleanup = () => {
          image.removeEventListener('load', onLoad)
          image.removeEventListener('error', onError)
        }
        const done = () => {
          cleanup()
          resolve()
        }
        const onLoad = () => decode().then(done)
        const onError = done

        image.addEventListener('load', onLoad, { once: true })
        image.addEventListener('error', onError, { once: true })
        cleanups.push(cleanup)
      })
    }

    const markLoaded = () => {
      if (active) setLoaded(true)
    }

    Promise.all([...container.querySelectorAll('img')].map(settle)).then(markLoaded, markLoaded)

    return () => {
      active = false
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [container])

  return [ref, loaded]
}

export default useImagesLoaded
