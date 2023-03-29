<script>
	import { fade } from 'svelte/transition';
	
	export let features;
	export let path;
	export let stroke;
	export let strokeWidth;
	export let fillOpacity;
	export let fill;
	export let laag;
	export let igsdata;

</script>

<!--
@component
This component renders a map layer with intermunicipal cooperations.
-->

{#each features as feature}
	{#if laag == 'igs' && !igsdata}
		<path
			d={path(feature)}
			fill={fill}
			stroke={stroke}
			stroke-width={strokeWidth}
			stroke-linejoin="round"
			fill-opacity={fillOpacity}
			transition:fade
		/>
	{/if}
	{#if laag == 'igs' && igsdata}
	<path
		d={path(feature)}
		fill={igsdata.find((d) => d.igs == feature.id) ? igsdata.find((d) => d.igs == feature.id).colour : 'none'}
		stroke={igsdata.find((d) => d.igs == feature.id) ? igsdata.find((d) => d.igs == feature.id).colour : 'none'}
		stroke-width={strokeWidth}
		stroke-linejoin="round"
		fill-opacity={fillOpacity}
		transition:fade
	/>
{/if}
	<path
		d={path(feature)}
		fill={`url('#${laag}')`}
		stroke={stroke}
		stroke-width={strokeWidth}
		stroke-linejoin="round"
		fill-opacity={1}
		transition:fade
	/>
{/each}

<style>
	path {
		pointer-events: none;
		/*mix-blend-mode: multiply;*/
	}
</style>
