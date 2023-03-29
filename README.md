# OP/TIL internal and public facing maps

## Intro

This repo contains the code for a public facing map showing [OP/TIL](https://www.cultuuroptil.be/) funded projects and intermunicipal cultural cooperations.

## Developing

Clone this repository, and npm install all node dependencies (you should have Node installed)

```bash
npm run install
```

Then you can start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

For a static build, make sure you import the Svelte adapter from `adapter-static` in [svelte.config.js](svelte.config.js):

```
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;

```

Then you can build a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app to services like Netlify and Vercel, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

If the map will not be served from the root of a domain, you need to set the path in [svelte.config.js](svelte.config.js):

```
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter(),
		paths: {base: '/path/to/your/app'}
	}
};

export default config;

```

In that case, all internal links and links to assets like images need to be prepended with this path:

```
<script>
import { base } from '$app/paths';
</script>

<img src={`${base}/icons/home.svg`} width="20px" height="20px" />

```

## Source data

### Geodata

See the [optil-svg-kaart-data](https://github.com/maartenzam/optil-svg-kaart-data) repository for obtaining and processing the boundary data for the municipalities and districts. This repository takes shapefiles with official Belgian administrative boundary data, combines them, simplifies them and saves them as a geojson file. This geojson file needs to be converted to a topojson file (the easiest way to do this is to upload it to [mapshaper.org](https://mapshaper.org/) and download it as topojson).

The topojson should then be saved as [src/lib/data/munis_simple_nodata_topo.json](/src/lib/data/munis_simple_nodata_topo.json)

### Google Sheets data

The maps in this repository fetch data from 3 sheets from the [OpTil kaartdata](https://docs.google.com/spreadsheets/d/1lAygI1PiNQRWLjN0TdzMKppKkeFQN5L00_iL1nDa4qw/edit#gid=0) Google Sheet. This Sheet is public (anyone with the link can view), but can only be edited by people from OP/TIL.

The 3 sheets are:

- `oud_en_nieuw_extern_projecten`: contains the data of the projects that are shown on the public facing map. The `Coords` column of this sheet contains a formula to geocode the columns `Adres` and `Gemeente`, which are split into the `Latitude` and `Longitude`columns.
- `nieuw_extern_igsdata`: contains the detailed data for all the IGS's ('Intergemeentelijke Samenwerkingsverbanden'). This data is used in the popups for the municipalities in the public facing map.
- `nieuw_extern_en_intern_gemeentedata`: contains the data about which intermunicipal cooperation, province and reference region a municipality is part of.

These sheets are fetched each time the map application is loaded.

## Structure and functionality

The maps are a [SvelteKit](https://kit.svelte.dev/) app. The main application lives in [src/routes/+page.svelte](src/routes/+page.svelte).

The app has only one route: the root. From here, all the components, the topojson data described above, and the data from the Google Sheets are loaded. All components are in [src/lib/components](src/lib/components).

The map is a full screen SVG, with controls for the layers shown on top of it, with layer controls in the top left (`LayerControls` component), and map controls (`MapControls`) in the top right.

### Map layers

The main layer for the map is the `GemeenteLayer` component. It draws the outlines of the municipalities and districts, and reacts to clicks. When a municipality/disctrict is clicked, the `activeGemeente` variable is set to the data of the clicked municipality, and the `showInfo` variable is set to `true`. This will show the relevant information with the `GemeenteInfo` component.

The `ProjectLayer` shows a red dot for each of the projects in the data loaded from the `oud_en_nieuw_extern_projecten` tab in the Google Sheet. Clicking on a project opens a `ProjectInfo` popup for the clicked project.

The `MergedLayer`component is meant to be used together with the `getMergedData()` utility function. `getMergedData()`takes the data for the municipalities/districts (in topoJSON format) and merges the geographic features based on common values for the `mergeProperty` parameter. For example, the municipalities/districts can be merged into provinces with 

```
provincies = getMergedData(vlagem, 'provinciecode', [])
```

Here, `vlagem` is the topoJSON containing the boundaries of the municipalities, together with their attributes, including the `provinciecode` property. The last parameter (an empty array in the example above), is not relevant for this application. `getMergedData()` returns geoJSON polygons that can be rendered with `MergedLayer`.

`getMergedData()` also returns the centroid of each polygon, which is used by the `MergedLabelLayer` to render the names of the merged polygons.

The `GemeenteLabelLayer` component shows the names of the municipalities/disctricts. No labels are displayed when the map is zoomed out (or the screen is too small), only the 13 most important cities are shown on intermediate zoom levels, and all labels are shown when the map is sufficiently zoomed in/the screen is wide enough.

### Map controls

The `MapControls` component has buttons for:

- zooming in on the map (plus sign)
- zooming out of the map (minus sign)
- resetting the zoom and pan, so that the full map fits the screen again (home icon). This button is disabled when the map isn't zoomed or panned yet.
- downloading a screenshot of the map in it's current state as a PNG image file (download icon)

Panning the map is done by click-dragging (click and hold, then move).

### Layer controls

The layer controls in the `LayerControls` component has a slider to filter the projects shown on the map, and a checkbox to show the reference regions and their names.