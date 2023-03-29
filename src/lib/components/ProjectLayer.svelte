<script>
	import { fade } from 'svelte/transition';
	export let projects;
	export let clusters;
	export let activeProject;
	export let showProjectInfo;
	export let activeGemeente;
	export let clickPosition;
	export let projection;
	export let activeCluster;

	let activeClusterProject;

	function handleProjectClick(e, project) {
		activeGemeente = null;
		activeCluster = null;
		activeClusterProject = null;
		activeProject = project;
		showProjectInfo = true;
		clickPosition = [e.clientX, e.clientY];
	}
	function handleClusterProjectClick(e, project) {
		activeGemeente = null;
		activeProject = project;
		activeClusterProject = project;
		showProjectInfo = true;
		clickPosition = [e.clientX, e.clientY];
	}

	function handleClusterClick(e, cluster) {
		if (JSON.stringify(activeCluster) == JSON.stringify(cluster)) {
			activeCluster = null;
		} else {
			activeCluster = cluster;
			activeProject = null;
		}
	}
</script>

<!--
@component
This component renders a map layer with a dot for each project (public facing map only)
-->

{#if activeProject && !activeClusterProject}
	<circle
		cx={projection(activeProject.geometry.coordinates)[0]}
		cy={projection(activeProject.geometry.coordinates)[1]}
		r={8}
		fill={'black'}
		stroke={'black'}
		stroke-width={1.5}
		stroke-linejoin="round"
	/>
{/if}

{#each projects as project}
	<circle
		cx={projection(project.geometry.coordinates)[0]}
		cy={projection(project.geometry.coordinates)[1]}
		r={6}
		fill={'#fe5442'}
		stroke={'white'}
		stroke-width={1.5}
		on:click={(e) => handleProjectClick(e, project)}
		on:keydown={(e) => handleProjectClick(e, project)}
		transition:fade
	/>
{/each}

{#if activeCluster}
	{#each activeCluster.features as project, i}
		<line
			x1={projection(activeCluster.centroid.geometry.coordinates)[0]}
			x2={projection(activeCluster.centroid.geometry.coordinates)[0] +
				32 * Math.cos(((2 * Math.PI) / activeCluster.features.length) * i)}
			y1={projection(activeCluster.centroid.geometry.coordinates)[1]}
			y2={projection(activeCluster.centroid.geometry.coordinates)[1] +
				32 * Math.sin(((2 * Math.PI) / activeCluster.features.length) * i)}
			stroke={'#fe5442'}
			stroke-width={1.5}
			transition:fade
		/>
		
		{#if activeProject && activeClusterProject && project.properties.Naam == activeClusterProject.properties.Naam}
				<circle
					cx={projection(activeCluster.centroid.geometry.coordinates)[0] +
						32 * Math.cos(((2 * Math.PI) / activeCluster.features.length) * i)}
					cy={projection(activeCluster.centroid.geometry.coordinates)[1] +
						32 * Math.sin(((2 * Math.PI) / activeCluster.features.length) * i)}
					r={8}
					fill={'black'}
					stroke={'black'}
					stroke-width={1.5}
					stroke-linejoin="round"
					transition:fade
				/>
		{/if}

		<circle
			cx={projection(activeCluster.centroid.geometry.coordinates)[0] +
				32 * Math.cos(((2 * Math.PI) / activeCluster.features.length) * i)}
			cy={projection(activeCluster.centroid.geometry.coordinates)[1] +
				32 * Math.sin(((2 * Math.PI) / activeCluster.features.length) * i)}
			r={6}
			fill={'#fe5442'}
			stroke={'white'}
			stroke-width={1.5}
			on:click={(e) => handleClusterProjectClick(e, project)}
			on:keydown={(e) => handleClusterProjectClick(e, project)}
			transition:fade
		/>
	{/each}
{/if}

{#if clusters}
	{#each clusters as cluster}
		<circle
			cx={projection(cluster.centroid.geometry.coordinates)[0]}
			cy={projection(cluster.centroid.geometry.coordinates)[1]}
			r={8 + Math.sqrt(cluster.features.length)}
			fill={'#fe5442'}
			stroke={'white'}
			stroke-width={2}
			opacity={1}
			on:click={(e) => handleClusterClick(e, cluster)}
			on:keydown={(e) => handleClusterClick(e, cluster)}
		/>
		<text
			class="clustercount"
			x={projection(cluster.centroid.geometry.coordinates)[0]}
			y={projection(cluster.centroid.geometry.coordinates)[1] + 5}
			fill={'white'}
			text-anchor={'middle'}>{cluster.features.length}</text
		>
	{/each}
{/if}

<style>
	circle {
		cursor: pointer;
	}
	.clustercount {
		pointer-events: none;
	}
</style>
