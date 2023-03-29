<script>
    import { fade } from "svelte/transition";
    export let regios
    export let projection
    export let colour
    export let igsdata
    export let laag
</script>

<!--
@component
This component renders a map layer with the names of intermunicipal cooperations
-->

<g class={"labels-" + laag}>
{#each regios as regioLabel}
<text
    class="regio-label"
    x={projection(regioLabel.centroid)[0]}
    y={projection(regioLabel.centroid)[1]}
    text-anchor={'middle'}
    style:font-family={'Helvetica'}
    style:fill={igsdata ?  igsdata.find((d) => d.igs == regioLabel.id).colour : colour}
    transition:fade>{regioLabel.id}</text
>
{/each}
</g>

<style>
    .regio-label {
		font-size: 12px;
		text-transform: uppercase;
		text-shadow: -1px -1px white, -1px 1px white, 1px 1px white, 1px -1px white, -1px 0 white,
			0 1px white, 1px 0 white, 0 -1px white;
        pointer-events: none;
	}
</style>