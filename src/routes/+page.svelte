<script>
	import { onMount } from 'svelte';
	import { csv } from 'd3-fetch';
	import { autoType } from 'd3-dsv';
	import { feature } from 'topojson-client';
	import { geoMercator, geoPath } from 'd3-geo';
	import centroid from '@turf/centroid';
	import clustersDbscan from '@turf/clusters-dbscan';

	import GemeenteInfo from '$lib/components/GemeenteInfo.svelte';
	import ProjectInfo from '$lib/components/ProjectInfo.svelte';
	import MapControls from '$lib/components/MapControls.svelte';
	import LayerControls from '$lib/components/LayerControls.svelte';
	import ProjectLayer from '$lib/components/ProjectLayer.svelte';
	import MergedLayer from '$lib/components/MergedLayer.svelte';
	import GemeenteLayer from '$lib/components/GemeenteLayer.svelte';
	import GemeenteLabelLayer from '$lib/components/GemeenteLabelLayer.svelte';
	import MergedLabelLayer from '$lib/components/MergedLabelLayer.svelte';
	import getMergedData from '$lib/utils/getMergedData.js';

	import vlagem from '$lib/data/munis_simple_nodata_topo.json';

	// Initialise data
	let gemeenten = [];
	let provincies = [];
	let regios = [];
	let igsen = [];

	let projectdata;
	let rondes = [];
	let selected = [];
	let igsdata;
	let coopdata;

	let showRegios = false;

	let w;
	let h;

	let projection = geoMercator();

	let dataReady = false;

	onMount(async () => {
		// Let the geographic data fit into the screen
		projection.fitSize([w, h], feature(vlagem, vlagem.objects['munis_simple_nodata']));

		// Load data from Google Sheets
		projectdata = await csv(
			'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZv8Cfkf3RkuQ21XcEyN-qAoEwuDe3rUNLxv2JNhOFy6RZIYl-RtNI6SD8XGVI7DI-LGkvL6WdRCgN/pub?gid=0&single=true&output=csv',
			autoType
		);
		projectdata = projectdata.filter(d => d.Latitude && d.Longitude)

		rondes = [...new Set(projectdata.map((d) => d.Startdatum))];
		selected = [];

		// IGS data
		igsdata = await csv(
			'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZv8Cfkf3RkuQ21XcEyN-qAoEwuDe3rUNLxv2JNhOFy6RZIYl-RtNI6SD8XGVI7DI-LGkvL6WdRCgN/pub?gid=1116949341&single=true&output=csv'
		);
		coopdata = await csv(
			'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZv8Cfkf3RkuQ21XcEyN-qAoEwuDe3rUNLxv2JNhOFy6RZIYl-RtNI6SD8XGVI7DI-LGkvL6WdRCgN/pub?gid=1512650050&single=true&output=csv'
		);
		//}

		// Join the data on cooperations between municipalities to the geographic data
		vlagem.objects.munis_simple_nodata.geometries.forEach((gem) => {
			let gemdata = coopdata.find((d) => d.niscode == gem.properties.niscode);
			gem.properties = gemdata;
		});

		// Convert topojson to geojson
		gemeenten = feature(vlagem, vlagem.objects['munis_simple_nodata']).features;

		// Add the centroid coordinates for each gemeente
		gemeenten.forEach((d) => {
			d.properties.centroid = centroid(d).geometry.coordinates;
		});

		// getMergedData returns the geojson of gemeente features merged on some property in gemeente.properties
		provincies = getMergedData(vlagem, 'provinciecode', []);
		regios = getMergedData(vlagem, 'regio', []);
		igsen = getMergedData(vlagem, 'igs', []);

		// dataReady is used to only render things when all the data is fetched from Google Sheets, and processed
		dataReady = true;
	});

	// The projects to be shown on the map can be filtered by their Startdatum
	$: projectsToShow = projectdata ? projectdata.filter((m) => selected.includes(m.Startdatum)) : [];
	$: projectsToShowGeojson = {
			type: 'FeatureCollection',
			features: projectsToShow.map((d, i) => {
			if (d.Longitude && d.Latitude) {
				const feature = {
					type: 'Feature',
					properties: d,
					geometry: {
						type: 'Point',
						coordinates: [d.Longitude, d.Latitude]
					}
				};
				return feature
			}
		})
	}

	$: projectsToShowClustered = projectsToShowGeojson
		? projection.scale() < 20000
			? clustersDbscan(projectsToShowGeojson, 2)
			: projection.scale() > 100000
				? clustersDbscan(projectsToShowGeojson, 0.2)
				: projection.scale() > 40000
					? clustersDbscan(projectsToShowGeojson, 0.5)
					: clustersDbscan(projectsToShowGeojson, 1)
		: null;

	$: clusters = [
			...new Set(
				projectsToShowClustered.features.map((d) => d.properties.cluster).filter((d) => d == 0 || d)
			)
		].map((d) => {
			let obj = {};
			obj.cluster = d;
			obj.features = projectsToShowClustered.features.filter((f) => f.properties.cluster == d);
			obj.centroid = centroid({
				type: 'FeatureCollection',
				features: obj.features
			});
			return obj;
		});
	$: projectsOutsideClusters = projectsToShowClustered.features.filter((f) => f.properties.dbscan != 'core');

	// Converts geojson path data to SVG paths
	$: path = geoPath(projection);

	// Map interaction behaviour
	let clickedPoint;
	let dragging = false;
	let dragged = false;
	let previousLocation = [0, 0];
	let dragOffset = [0, 0];
	let scale;
	let initialScale;
	let initialCenter;
	let notZoomedYet = true;

	let activeGemeente;
	let activeCluster;
	let clickPosition = [0, 0];
	let showInfo = false;
	let activeProject;
	let showProjectInfo = false;

	// Clicking the map either initiates a drag, or opens an info window of a project or gemeente
	function onMouseDown(e) {
		// Store the initial scale and center of the map, for the reset zoom button
		if (notZoomedYet) {
			initialScale = projection.scale();
			initialCenter = projection.invert([w / 2, h / 2]);
		}
		dragging = true;
		dragged = false;
		clickedPoint = [e.clientX, e.clientY];
		previousLocation = clickedPoint;
	}

	function onMouseMove(e) {
		if (dragging) {
			dragOffset = [e.clientX - clickedPoint[0], e.clientY - clickedPoint[1]];
			dragged = true;
			activeProject = null;
			activeGemeente = null;
		}
	}

	function onMouseUp(e) {
		if (dragging) {
			notZoomedYet = false;
			dragging = false;
			let locationOffset = [e.clientX - clickedPoint[0], e.clientY - clickedPoint[1]];
			let newCenter = projection.invert([w / 2 - locationOffset[0], h / 2 - locationOffset[1]]);
			projection = projection.center(newCenter).translate([w / 2, h / 2]);
			dragOffset = [0, 0];
		}
	}
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />
<svelte:head>
	<style>
		@font-face {
			font-family: 'DrukWide';
			src: url('fonts/DrukWide/DrukWide-Medium.otf') format('opentype');
		}
		@font-face {
			font-family: 'Helvetica';
			src: url('fonts/Helvetica/Linotype - HelveticaNeueLTStd-Md.otf') format('opentype');
		}
		@font-face {
			font-family: 'Clearface';
			src: url('fonts/Clearface/ITC - ClearfaceStd-Bold.woff');
		}
	</style>
</svelte:head>

<div class="map-container" bind:clientWidth={w} bind:clientHeight={h}>
	<svg
		id="map"
		width={w}
		height={h}
		on:mousedown={onMouseDown}
		transform={`translate(${dragOffset[0]},${dragOffset[1]})`}
		style:cursor={dragging ? 'move' : 'default'}
	>
		{#if path && !isNaN(projection.scale())}
			<g class="gemeente-polys">
				<GemeenteLayer
					{gemeenten}
					{path}
					bind:activeGemeente
					bind:activeProject
					bind:activeCluster
					bind:showInfo
					bind:dragged
					bind:clickPosition
				/>
			</g>

			{#if igsdata}
				<g class="igs-polys">
					<MergedLayer features={igsen} {path} {igsdata} strokeWidth={2} fillOpacity={0.5} laag={'igs'}/>
				</g>
			{/if}

			<g class="provincie-polys">
				<MergedLayer
					features={provincies}
					{path}
					strokeWidth={1.5}
					fillOpacity={1}
					stroke={'#666'}
					fill={'none'}
					laag={'provincies'}
				/>
			</g>

			{#if showRegios}
				<g class="regio-polys">
					<MergedLayer
						features={regios}
						{path}
						strokeWidth={1.5}
						fillOpacity={1}
						stroke={'#fe5442'}
						fill={'none'}
						laag={'regio'}
					/>
				</g>
			{/if}

			{#if activeGemeente}
				<path
					class="active-outline"
					d={path(activeGemeente)}
					stroke-width={2}
					stroke={'#000000'}
					fill="none"
					stroke-linejoin="round"
				/>
			{/if}

				<ProjectLayer
					projects={projectsOutsideClusters}
					{clusters}
					bind:activeProject
					bind:showProjectInfo
					bind:activeGemeente
					bind:clickPosition
					bind:activeCluster
					{projection}
				/>

			<GemeenteLabelLayer {gemeenten} {scale} {projection} />

			{#if igsdata && igsen}
				<MergedLabelLayer regios={igsen} {projection} {igsdata} />
			{/if}

			{#if showRegios}
				<MergedLabelLayer {regios} {projection} colour={'red'} />
			{/if}
		{/if}
	</svg>
</div>

<MapControls
	bind:projection
	bind:scale
	bind:initialScale
	bind:initialCenter
	bind:notZoomedYet
	bind:activeCluster
	{w}
	{h}
/>

{#if rondes.length > 0}
	<LayerControls bind:selected bind:showRegios {rondes} />
{/if}

{#if activeGemeente && showInfo}
	<GemeenteInfo
		bind:activeGemeente
		bind:showInfo
		{clickPosition}
		{w}
		{h}
		igsInfo={activeGemeente.properties.igs
			? igsdata.find((d) => d.igs == activeGemeente.properties.igs)
			: null}
	/>
{/if}

{#if activeProject && showProjectInfo}
	<ProjectInfo bind:activeProject bind:showProjectInfo {clickPosition} {w} {h} />
{/if}

<style>
	svg {
		overflow: visible;
	}
	:global(html, body) {
		margin: 0;
		box-sizing: border-box;
		font-family: 'Helvetica';
	}
	.map-container {
		width: 100%;
		height: 100vh;
	}
	.regio-polys,
	.provincie-polys,
	.igs-polys,
	.active-outline {
		pointer-events: none;
	}
</style>
