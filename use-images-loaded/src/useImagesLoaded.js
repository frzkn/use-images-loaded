'use strict'
import { useEffect, useState, useRef } from 'react'

const useImagesLoaded = () => {
  const ref = useRef(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const resolveReference = []
    const imageElements = ref.current.getElementsByTagName('img')
    const promisesArray = [...imageElements].map((img) => {
      if (!img.complete) {
        return new Promise((resolve) => {
          resolveReference.push(resolve)
          img.addEventListener('load', resolve, { once: true })
        })
      } else return null
    })
    if (promisesArray.length > 0) {
      Promise.all(promisesArray).then(() => {
        setImagesLoaded(true)
      })
    }

    return () => {
      imageElements.forEach((img, index) => {
        console.log(resolveReference)
        img.removeEventListener('load', resolveReference[index])
      })
    }
  }, [ref])
  return [ref, imagesLoaded]
}

export default useImagesLoaded
