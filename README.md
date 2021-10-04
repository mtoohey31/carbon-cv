# Carbon CV

A CV template written in Svelte using [`carbon-components-svelte`](https://github.com/carbon-design-system/carbon-components-svelte) and configured in YAML.

![screenshot](https://user-images.githubusercontent.com/36740602/135888350-847e8cb4-26c5-4278-aae1-03efc3d94321.png)

## Usage

```sh
git clone https://github.com/mtoohey31/carbon-cv
cd carbon-cv
pnpm i # npm or yarn should work too, use whatever you prefer
cp cv.example.yaml cv.yaml
pnpm run dev

pnpm run build-pdf # to export to a pdf at build/cv.pdf
pnpm run build-html # to export to static html at build/cv.html
```

If you'd like to store your CV in a git repository too, I'd recommend creating a separate **private** repository, then symlinking `cv.yaml` in the `carbon-cv` directory to the `cv.yaml` file in your git repo. As an example, the symlink in the following folder structure:

```
carbon-cv
├── .git
├── .gitignore
├── build
├── cv.example.yaml
├── cv.yaml -> ../cv/cv.yaml # the symlink in question
├── dist
├── index.html
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── README.md
├── schema.yaml
├── scripts
├── src
├── svelte.config.js
├── tsconfig.json
└── vite.config.js
cv
├── .git
└── cv.yaml
```

...can be created with the following command:

```sh
pwd # should output .../carbon-cv
ln -sn ../cv/cv.yaml cv.yaml
```
