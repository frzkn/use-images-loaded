## 🖼️ useImagesLoaded

Custom react hook which returns true once all the images inside a container are loaded.

Check out a working demo [here](https://use-images-loaded.netlify.app)

### 🚀 Getting Started

#### Installation

```
yarn add use-images-loaded
```

#### Usage

Displaying a loading indicator while images are loading in a container

```
import useImageLoaded from 'use-images-loaded'

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
