# use-images-loaded

A tiny React hook that reports when the initial images inside a client-rendered container have settled.

## Install

```sh
npm install use-images-loaded
```

## Usage

```jsx
'use client'

import { useImagesLoaded } from 'use-images-loaded'

function Gallery() {
  const [ref, loaded] = useImagesLoaded()

  return (
    <div ref={ref} aria-busy={!loaded}>
      <p>{loaded ? 'Ready' : 'Loading'}</p>
      <img src="/one.jpg" alt="" />
      <img src="/two.jpg" alt="" />
    </div>
  )
}
```

The first render is `false`. After hydration, the hook snapshots the container's images and becomes `true` when each one has decoded or failed. An empty container also becomes `true`.

Only the initial snapshot is tracked. Images inserted later or given a new `src` are not observed; remount the container when you need a fresh snapshot. Images using `loading="lazy"` may intentionally delay readiness until they approach the viewport.

Use this for coordinated gallery reveals, layout measurement, canvas work, or screenshots. It does not replace dimensions, `aspect-ratio`, responsive images, optimization, or server data loading.

## API

```ts
useImagesLoaded<T extends HTMLElement>(): readonly [RefCallback<T>, boolean]
```

In React Server Components frameworks, call the hook from a Client Component. The package supports React 16.8 through React 19.

## Contributing

Run `yarn`, then `yarn test`. Use `yarn develop` to run the existing example alongside the hook watcher.

[MIT](LICENSE)
