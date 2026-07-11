import { useImagesLoaded } from '../../use-images-loaded'

import { toCamel } from '../lib/util'

import hookConfig from '../../use-images-loaded/package.json'

export default function Index() {
  const { name, description, repository = {}, author = {} } = hookConfig

  const { name: authorName, url: authorUrl } = author

  const { url: repositoryUrl } = repository
  const repositoryExists = typeof repositoryUrl === 'string'

  const repositoryUrlDisplay = repositoryExists && repositoryUrl.split('://')[1]

  const [ref, loaded] = useImagesLoaded()

  return (
    <main>
      <style jsx global>{`
        body {
          font-family: sans-serif;
          padding: 0;
          margin: 0;
        }

        main {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1em 1em;
        }

        h1 {
          font-size: 2em;
        }

        .img-container {
          display: grid;
          grid-template-columns: auto auto auto;
          justify-items: start;
          grid-gap: 0.25rem;
        }

        img {
          max-width: 100%;
          padding: 0.25em;
        }

        pre {
          overflow: auto;
          max-height: 18em;
          background-color: #eeeeee;
          padding: 1em;
        }

        section,
        footer {
          width: 100%;
          max-width: 50em;
          margin: 0 auto;
        }

        footer p {
          font-size: 0.9em;
        }

        footer p,
        footer a {
          color: #546e7a;
        }
      `}</style>

      <section>
        <h1>{toCamel(name)}</h1>
        <p>{description}</p>
        {repositoryExists && (
          <p>
            <a href={repositoryUrl}>{repositoryUrlDisplay}</a>
          </p>
        )}
        <h2>Installation</h2>
        <p>Install with npm</p>
        <pre>
          <code>npm install use-images-loaded</code>
        </pre>
        <p>Install with yarn</p>
        <pre>
          <code>yard add use-images-loaded</code>
        </pre>
        <h2>Usage</h2>
        <p>Displaying a loading indicator while images are loading in a container</p>
        <pre>
          <code>
            {`import useImageLoaded from 'use-image-loaded'

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
`}
          </code>
        </pre>

        <h2>See it in action</h2>

        <div ref={ref}>
          <p> Status: {loaded ? 'Loaded' : 'Loading'} </p>
          <div className="img-container">
            <img src="https://unsplash.it/2000/2000" alt="image" />
            <img src="https://unsplash.it/2000/2000" alt="image" />
            <img src="https://unsplash.it/2000/2000" alt="image" />
          </div>
        </div>
      </section>

      <footer>
        <p>
          Made by <a href={authorUrl}>{authorName}</a>
        </p>
      </footer>
    </main>
  )
}
