'use strict'
import { useEffect, useState } from 'react'

const useImagesLoaded = () => {
  const [ref, setRef] = useState(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    let promisesArray = []
    if (!ref) return
    const imageElements = ref.querySelectorAll('img')
    imageElements.forEach((img) => {
      if (!img.complete) {
        let promise = new Promise((resolve) => {
          img.addEventListener('load', () => {
            resolve()
          })
        })
        promisesArray.push(promise)
      }
    })
    if (promisesArray.length > 0) {
      Promise.all(promisesArray).then(() => {
        setImagesLoaded(true)
      })
    }
  }, [ref])
  return [setRef, imagesLoaded]
}

export default useImagesLoaded
