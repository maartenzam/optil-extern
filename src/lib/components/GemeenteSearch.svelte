<script>
    import Select from 'svelte-select';

    export let gemeenten
    export let activeGemeente

    // Uncommenting the showInfo lines will display a popup when a municipality is selected, but the location of the popup is not set, because this is set by clicking on the map
    //export let showInfo

    $: items = gemeenten.map(d => {
        return {value: d.properties.niscode, label: d.properties.naam}
    }).sort((a,b) => a.label > b.label ? 1 : -1)

    function handleChange(e){
        activeGemeente = gemeenten.find(d => d.properties.niscode == e.detail.value)
        //showInfo = true
    }
    let nisresult
    $: if(!activeGemeente) {
        nisresult = null
    }
</script> 

<!--
@component
This component is a search box to locate a municipality on the map
-->

<Select
    bind:value={nisresult}
    items={items}
    on:change={handleChange}
    placeholder={'Zoek gemeente'}
    --height="34px"
    --padding="6px"
    --border-radius="2px"
    --font-size="14px"
    ></Select>

<style>
    :global(.value-container) {
        padding: 0px !important;
    }
</style>