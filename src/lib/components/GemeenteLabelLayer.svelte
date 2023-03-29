<script>
    import { fade } from 'svelte/transition';
	export let gemeenten;
    export let projection;

	const biggestMunicipalities = ['Antwerpen', 'Gent', 'Brugge', 'Leuven', 'Hasselt', 'Aalst', 'Mechelen', 'Sint-Niklaas', 'Oostende', 'Kortrijk', 'Genk', 'Roeselare', 'Turnhout']
</script>

<!--
@component
This component renders the names of municipalities on top of the maps.

Labels to render depend on the zoom of the map (projection.scale()
-->

<g class="gemeente-labels">
{#each gemeenten as centroid}
	{#if biggestMunicipalities.includes(centroid.properties.naam) && projection.scale() > 20000}
		<text
			class="municipality-label"
			x={projection(centroid.properties.centroid)[0]}
			y={projection(centroid.properties.centroid)[1]}
			style:font-family={'Helvetica'}
			text-anchor={'middle'}
            transition:fade>{centroid.properties.naam}</text
		>
	{/if}
	{#if projection.scale() > 45000}
		<text
			class="municipality-label"
			x={projection(centroid.properties.centroid)[0]}
			y={projection(centroid.properties.centroid)[1]}
			style:font-family={'Helvetica'}
			text-anchor={'middle'}
            transition:fade>{centroid.properties.naam}</text
		>
	{/if}
{/each}
</g>

<style>
    .municipality-label {
		fill: grey;
		font-size: 12px;
		text-shadow: -1px -1px white, -1px 1px white, 1px 1px white, 1px -1px white, -1px 0 white,
			0 1px white, 1px 0 white, 0 -1px white;
        pointer-events: none;
	}
</style>
