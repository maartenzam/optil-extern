<script>
	import { base } from '$app/paths';
	import * as saveSvgAsPng from 'save-svg-as-png';

	export let projection
	export let scale
	export let initialScale;
	export let initialCenter;
	export let notZoomedYet
	export let w
	export let h
	export let activeCluster
	
	function downloadChart() {
		saveSvgAsPng.saveSvgAsPng(document.querySelector('#map'), 'gemeentenkaart.png', {
			backgroundColor: '#ffffff'
		});
	}

	function zoom(factor) {
		activeCluster = null;
		// Set initial scale and center, in order to be able to reset the zoom (with resetZoom() defined below)
		if (notZoomedYet) {
			initialScale = projection.scale();
			initialCenter = projection.invert([w / 2, h / 2]);
			notZoomedYet = false;
		}
		scale = projection.scale() * factor;
		let center = projection.invert([w / 2, h / 2]);
		projection = projection
			.scale(scale)
			.center(center)
			.translate([w / 2, h / 2]);
	}
	function resetZoom() {
		activeCluster = null;
		projection = projection
			.scale(initialScale)
			.center(initialCenter)
			.translate([w / 2, h / 2]);
		scale = initialScale;
		notZoomedYet = true
	}

</script>

<!--
@component
This component is the UI for the map controls (zooming, displaying the ScenarioTable component and taking a snapshot of the map)
-->

<div class="controls">
	<div class="zoom-controls">
		<button class="zoom in" on:click={() => zoom(1.5)}
			><img src={`${base}/icons/zoomin.svg`} width="20px" height="20px" /></button
		>
		<button class="zoom out" on:click={() => zoom(0.666667)}
			><img src={`${base}/icons/zoomout.svg`} width="20px" height="20px" /></button
		>
	</div>
	<div class="home-button">
		<button class="home" on:click={() => resetZoom()} disabled={notZoomedYet}
			><img src={`${base}/icons/home.svg`} width="20px" height="20px" /></button
		>
	</div>
	<div class="download-button">
		<button class="download" on:click={downloadChart}
			><img src={`${base}/icons/download.svg`} width="20px" height="20px" /></button
		>
	</div>
</div>

<style>
    .controls {
		position: absolute;
		top: 10px;
		right: 10px;
	}
	.zoom-controls {
		display: flex;
		flex-direction: column;
		border: 3px solid rgba(220, 220, 220, 0.5);
		border-radius: 4px;
		width: 30px;
		margin-bottom: 6px;
	}
	.zoom {
		border: none;
		background-color: white;
		cursor: pointer;
	}
	.zoom img {
		margin-top: 4px;
	}
	.zoom.in {
		border-bottom: 1px solid #ddd;
	}
	.download, .home {
		background-color: white;
		border: 3px solid rgba(220, 220, 220, 0.5);
		width: 36px;
		border-radius: 4px;
		padding: 2px 4px;
		cursor: pointer;
		margin-bottom: 6px;
	}
	button:disabled {
		opacity: 0.3;
		cursor: default;
	}
</style>