import type { RefCallback } from 'react'

export function useImagesLoaded<T extends HTMLElement = HTMLElement>(): readonly [
  RefCallback<T>,
  boolean,
]
