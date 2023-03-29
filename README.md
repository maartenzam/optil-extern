# OP/TIL internal and public facing maps

## Intro

This repo contains the code for a public facing map showing [OP/TIL](https://www.cultuuroptil.be/) funded projects, and a map for internal use by OP/TIL to show the overlap in intermunicipal cultural collaborations in Flanders.

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

## Source data

### Geodata

See the [optil-svg-kaart-data](https://github.com/maartenzam/optil-svg-kaart-data) repository for obtaining and processing the boundary data for the municipalities and districts. This repository takes shapefiles with official Belgian administrative boundary data, combines them, simplifies them and saves them as a geojson file. This geojson file needs to be converted to a topojson file (the easiest way to do this is to upload it to [mapshaper.org](https://mapshaper.org/) and download it as topojson).

The topojson should then be saved as [src/lib/data/munis_simple_nodata_topo.json](/src/lib/data/munis_simple_nodata_topo.json)

### Google Sheets data

The maps in this repository fetch data from 3 sheets from the [OpTil kaartdata](https://docs.google.com/spreadsheets/d/1lAygI1PiNQRWLjN0TdzMKppKkeFQN5L00_iL1nDa4qw/edit#gid=0) Google Sheet. This Sheet is public (anyone with the link can view), but can only be edited by people from OP/TIL.

The 3 sheets are:

- `projecten`: contains the data of the projects that are shown on the public facing map. The `Coords` column of this sheet contains a formula to geocode the columns `Adres` and `Gemeente`, which are split into the `Latitude` and `Longitude`columns.
- `igsdata`: contains the detailed data for all the IGS's ('Intergemeentelijke Samenwerkingsverbanden'). This data is used in the popups for the municipalities in the public facing map.
- `gemeentedata`: contains the data about which intermunicipal cooperation a municipality is part of. This data is used in the internal map.

These sheets are fetched each time the map application is loaded.

## Structure and functionality

The maps are a [SvelteKit](https://kit.svelte.dev/) app. The main application lives in [src/routes/+page.svelte](src/routes/+page.svelte).

The app has only one route: the root. From here, all the components, the topojson data described above, and the data from the Google Sheets is loaded. All components are in [src/lib/components](src/lib/components).

The map is a full screen SVG, with controls for the layers shown on top of it, with layer controls in the top left (`LayerControls` component for the external map, and `InternLayerControls` for the internal map), and map controls (`MapControls`) in the top right.

### Map layers

The main layer for the map is the `GemeenteLayer` component. It draws the outlines of the municipalities and districts, and reacts to clicks. When a municipality/disctrict is clicked, the `activeGemeente` variable is set to the data of the clicked municipality, and the `showInfo` variable is set to `true`. Depending on the value of `mapType` ("extern" or "intern"), this will show the relevant information with either the `GemeenteInfo`or the `GemeenteScenarioInfo` components.

The `ProjectLayer` is only shown on the public facing map, and shows a red dot for each of the projects in the data loaded from the `projecten` tab in the Google Sheet. Clicking on a project opens a `ProjectInfo` popup for the clicked project.

The `MergedLayer`component is meant to be used together with the `getMergedData()` utility function. `getMergedData()`takes the data for the municipalities/districts (in topoJSON format) and merges the geographic features based on common values for the `mergeProperty` parameter. For example, the municipalities/districts can be merged into provinces with 

```
provincies = getMergedData(vlagem, 'provinciecode', [])
```

Here, `vlagem` is the topoJSON containing the boundaries of the municipalities, together with their attributes, including the `provinciecode` property. The last parameter (an empty array in the example above), is used to integrate user defined changes in the cooperations between municipalities for the internal map (see further). `getMergedData()` returns geoJSON polygons that can be rendered with `MergedLayer`.

`getMergedData()` also returns the centroid of each polygon, which is used by the `MergedLabelLayer` to render the names of the merged polygons.

The `GemeenteLabelLayer` component shows the names of the municipalities/disctricts. On the external map, no labels are displayed when the map is zoomed out (or the screen is too small), only the 13 most important cities are shown on intermediate zoom levels, and all labels are shown when the map is sufficiently zoomed in/the screen is wide enough. On the internal map, all labels are displayed when the 'Toon gemeentenamen' checkbox is checked.

### Map controls

The `MapControls` component has buttons for:

- zooming in on the map (plus sign)
- zooming out of the map (minus sign)
- resetting the zoom and pan, so that the full map fits the screen again (home icon). This button is disabled when the map isn't zoomed or panned yet.
- downloading a screenshot of the map in it's current state as a PNG image file (download icon)
- displaying the table with the user defined changes in municipal cooperations (only for the internal map, hamburger icon)

Panning the map is done by click-dragging (click and hold, then move).

### Layer controls external map

WAIT FOR INPUT ON START DATES

### Layer controls internal map

The layer controls of the internal map (`InternLayerControls` component) has the following controls:

- 'Toon naam samenwerkingen' will show the names of the intermunicipal cooperations of the selected layers of cooperations (see below)
- 'Toon gemeentenamen' will show the names of all municipalities and districts
- The 'Zoek gemeente' is an autocomplete search box to locate a municipality on the map. A selected gemeente will be shown with a thick black outline on the map
- the 9 selectable layers (each with their identifying colors) below each will add a layer with municipal cooperations to the map. When a layer is checked, a search box for that layer is added at the bottom of the layer controls. With this search box, one or more intermunicipal cooperations can be highlighed on the map (non-selected cooperations will not be shown). When the search box is cleared, all the cooperations in the layer will be shown again.

The colors for the 9 selectable layers are defined in [src/lib/styles/styles.js](src/lib/styles/styles.js).

### User defined changes on the internal map

On the internal map, simulations of municipalities moving from one cooperation to another can be shown. To change the cooperations a municipality is part of, click on a municipality to open its popup (check 'Toon gemeentenamen', or use the 'Zoek gemeente' search box to locate a specific municipality). This popup (which is the `GemeenteScenarioInfo` component) contains a list of dropdowns showing the cooperations the municipality is part of. Users can use the dropdowns to select a different cooperation for each of the layers, to simulate a change in the cooperation the municipality is part of.

When a municipality is moved from a current cooperation to a simulated one, the background of the dropdown box is colored in light red.

Users can manage the simulated cooperations with the table that is displayed when the button with the hamburger (3 horizontal lines) in the map controls is clicked (this opens the `ScenarioTable` component). Here, every simulated change is displayed in a table, and you can remove any of the changes, or remove all the changes in one go.

The user defined changes to the cooperations the municipalities are part of, are stored in a Svelte store called `scenarios`, see [src/lib/stores/stores.js](src/lib/stores/stores.js). For each of the cooperation layers, the user defined changes are stored in an array of objects, each with the properties `niscode` (which is a unique key for the municipalities/districts), `from` (which holds the name of the initial cooperation the municipality is part of) and `to` (the cooperation the municipality was assigned to by the user).

The main component for updating the `scenarios` store is the `ScenarioSelect` component.





