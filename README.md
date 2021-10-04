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
