## 🖼️ useImagesLoaded

Custom react hook which returns true once all the images inside a container are loaded.

### 🚀 Getting Started

#### Installation

```
yarn add use-images-loaded
```

#### Usage

Displaying a loading indicator while images are loading in a container

```
import useImageLoaded from 'use-image-loaded'

const ImageContainer = () => {
  const [ref, loaded] = useImagesLoaded()

  return (
    <div ref={ref}>
    <p> Status: {loaded ? 'Loaded': 'Loading'} </p>
    <img src="https://unsplash.it/200/200" alt="image"/>
    <img src="https://unsplash.it/200/200" alt="image"/>
    <img src="https://unsplash.it/200/200" alt="image"/>
    </div>
  )
}
```
