<script>
    import { fade } from 'svelte/transition';
	export let gemeenten;
	export let path;
	export let activeGemeente;
	export let activeProject;
	export let activeCluster;
	export let dragged;
	export let showInfo;
	export let clickPosition;

	function handleClick(e, gemeente) {
		if (!dragged) {
			activeProject = null;
			activeCluster = null;
			activeGemeente = gemeente;
			showInfo = true;
			clickPosition = [e.clientX, e.clientY];
			dragged = false;
		}
	}
</script>

<!--
@component
This component renders the outlines of municipalities and handles clicks
-->

{#each gemeenten as gemeente}
	<path
		d={path(gemeente)}
		fill={'#ffffff'}
		fill-opacity={0}
		stroke={'#ccc'}
		stroke-width={1}
		stroke-linejoin="round"
		on:click={(e) => handleClick(e, gemeente)}
		on:keydown={(e) => handleClick(e, gemeente)}
        transition:fade
	/>
{/each}
