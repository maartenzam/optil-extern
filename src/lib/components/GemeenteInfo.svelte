<script>
	export let activeGemeente;
	export let clickPosition;
	export let igsInfo;
	export let showInfo;
	export let w;
	export let h;

	function handleClick() {
		showInfo = false;
		activeGemeente = null;
	}
</script>

<!--
@component
This component shows a popup on top of the public facing map when the user clicks on a municipality
-->

<div
	class="gemeente-info"
	style:left={clickPosition[0] < w - 380 ? clickPosition[0] + 30 + 'px' : 'auto'}
    style:right={clickPosition[0] > w - 380 ? w - clickPosition[0] + 30 + 'px' : 'auto'}
	style:top={clickPosition[1] < h - 400 ? clickPosition[1] + 'px' : 'auto'}
    style:bottom={clickPosition[1] > h - 400 ? h - clickPosition[1] + 'px' : 'auto'}
	style:background-color={igsInfo ? igsInfo.colour : '#ffffff'}
>
	<button class="close-button" on:click={() => handleClick()}>X</button>
	<h3>{activeGemeente.properties.naam}</h3>
	{#if igsInfo}
		<div class="igs-popup-content">
			<h4>IGS</h4>
			<p>{igsInfo.igs}</p>
			<h4>Adres</h4>
			<p>{igsInfo.adres}</p>
			<h4>Lidgemeenten IGS</h4>
			<p>{igsInfo.gemeenten}</p>
			<h4>Contactpersoon</h4>
			<p>{igsInfo.contactpersoon}</p>
			{#if igsInfo.url}
				<p>
					<a href={`https://${igsInfo.url}`} target="_blank" rel="noreferrer">{igsInfo.urlText}</a
					><span class="arrow">→</span>
				</p>
				<p />{/if}
			{#if igsInfo.extraUrl}
				<p>
					<a href={`https://${igsInfo.extraUrl}`} target="_blank" rel="noreferrer"
						>{igsInfo.extraUrlText}</a
					><span class="arrow">→</span>
				</p>
				<p />{/if}
		</div>
	{/if}
</div>

<style>
	.gemeente-info {
		position: absolute;
		background-color: white;
		padding: 8px;
		max-width: 350px;
		box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
	}
	.close-button {
		position: absolute;
		top: 0px;
		right: 0px;
		border: none;
		padding: 0.5rem;
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
