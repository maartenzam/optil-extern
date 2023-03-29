<script>
	export let activeProject;
	export let clickPosition;
    export let showProjectInfo;
    export let w;
	export let h;

    function handleClick(){
        showProjectInfo = false;
        activeProject = null
    }
</script>

<!--
@component
This component renders a popup with the data of a project (public facing map only)
-->


<div class="gemeente-info"
style:left={clickPosition[0] < w - 380 ? clickPosition[0] + 30 + 'px' : 'auto'}
style:right={clickPosition[0] > w - 380 ? w - clickPosition[0] + 30 + 'px' : 'auto'}
style:top={clickPosition[1] < h - 200 ? clickPosition[1] + 'px' : 'auto'}
style:bottom={clickPosition[1] > h - 200 ? h - clickPosition[1] + 'px' : 'auto'}
    >
    <button class="close-button" on:click={() => handleClick()}>X</button>
	<h3>{activeProject.properties.Naam}</h3>
    <p>{activeProject.properties.Omschrijving}</p>
    {#if activeProject.properties.Contactpersoon}
    <h4>Contactpersoon</h4>
    <p>{activeProject.properties.Contactpersoon}</p>
    {/if}
    {#if activeProject.properties.Url && activeProject.properties.UrlText}
    <p><a href={`https://${activeProject.properties.Url}`} target="_blank" rel="noreferrer">{activeProject.properties.UrlText}</a><span class="arrow">→</span></p>
    {/if}
    {#if activeProject.properties.ExtraUrl && activeProject.properties.ExtraUrlText}
    <p><a href={`https://${activeProject.properties.ExtraUrl}`} target="_blank" rel="noreferrer">{activeProject.properties.ExtraUrlText}</a><span class="arrow">→</span></p>
    {/if}
</div>

<style>
	.gemeente-info {
		position: absolute;
		background-color: white;
		padding: 8px;
        max-width: 350px;
        box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
        background-color: #fe5442;
	}
    .close-button {
        position: absolute;
        top: 0px;
        right: 0px;
        border: none;
        padding-top: 0.5rem;
        background-color: inherit;
        font-weight: 700;
        cursor: pointer;
    }
	h3 {
		font-family: 'DrukWide';
	}
    h4 {
        margin: 0px;
    }
    .gemeente-info p {
        margin: 0px 0px 1rem 0px;
        font-weight: 400;
        font-size: 0.9rem;
    }
    p a {
        text-decoration: none;
        color: rgb(10, 10, 10);
    border-bottom: 1px solid rgb(10, 10, 10);
    padding-bottom: 2px;
    }
    .arrow {
    font-size: 16px;
    padding-left: 9px;
  }
</style>
