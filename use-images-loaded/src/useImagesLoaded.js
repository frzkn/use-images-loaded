'use strict'
import { useEffect, useState } from 'react'

const useImagesLoaded = () => {
  const [ref, setRef] = useState(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    if (!ref) return
    const imageElements = ref.getElementsByTagName('img')
    const promisesArray = [...imageElements].map((img) => {
      if (!img.complete) {
        return new Promise((resolve) => {
          img.addEventListener(
            'load',
            () => {
              resolve()
            },
            { once: true }
          )
        })
      } else return null
    })
    if (promisesArray.length > 0) {
      console.log(promisesArray)
      Promise.all(promisesArray).then(() => {
        setImagesLoaded(true)
      })
    }
  }, [ref])
  return [setRef, imagesLoaded]
}

export default useImagesLoaded
