# 🧰 useCustomHook: React Hook Starter

A starter template for creating a new React Hook.

## 🚀 Getting Started

### tl;dr
* `git clone https://github.com/colbyfayock/use-custom-hook [directory]`
* `cd [directory]`
* `yarn install && yarn setup`
* `cd [hook-name] && npm publish`

### Set up a new repository
* Clone the `useCustomHook` repo locally and navigate to the project

```
git clone https://github.com/colbyfayock/use-custom-hook [directory]
cd [directory]
```

* Install packages

```
yarn install
```

* Run setup scripts

```
yarn setup
```

During this process, the scripts will ask you for your name and your custom hook's name, including both a camelCase variation (useCustomHook) and a snake-case variation (use-custom-hook).

It will replace all instances of the default useCustomHook name with your chosen name. Additionally, it will replace the name in the license and author name in the hook's `package.json` file with your name.

Lastly, the script will clean up the setup scripts and reset the git history with a fresh commit.

This can only be ran once, as it will clean up the script files immediately after running.

Make sure you remember to update your email address, author URL, git addresses, and anything else within the `[hook-name]/package.json` file.

### Developing with your hook
Running `yarn develop` in the root of this project will kick off a watch command in both the `example` and hook workspaces. This means any time you make a change to the hook, it will build, and subsequently, your example page will refresh with that new hook build.

### Updating the example
There's an example app set up in the `example` directory. You can use this space to add examples and any preferred documentation for your custom hook.

### Publishing
* Navigate to your hook directory (default is use-custom-hook)

```
cd [hook-name]
```

* Log in to npm

```
npm login
```

* Publish 🎉

```
npm publish
```

### Depliying your example
Running `yarn build` in the root directory will create a new static build of the example website available in the `example/out` folder. This is standard HTML that can be uploaded to any static hosting software.
