<script>
  import { fade } from "svelte/transition";
  export let rondes;
  export let selected;
  export let showRegios;

  let sliderValue = rondes.length;
  $: selected = rondes.slice(0, sliderValue);

  $: rondeLabels = rondes.map((d) => d.replace("vanaf ", ""));
</script>

<!--
@component
This component is the UI for controlling which layers are visible on the public facing map
-->

<div class="marker-filter-container" transition:fade>
  <h2>Startdatum projecten</h2>
  <div class="slider-container">
    <label for="overlay-opacity">{rondeLabels[sliderValue - 1]}</label>
    <input
      type="range"
      id="slider"
      min={1}
      max={rondes.length}
      step={1}
      bind:value={sliderValue}
    />
  </div>
  <!--ul class="unstyled centered">
        {#each rondes as ronde}
            <li>
                <input
                    class="styled-checkbox"
                    id={'styled-checkbox-' + ronde}
                    type="checkbox"
                    value={ronde}
                    bind:group={selected}
                />
                <label for={'styled-checkbox-' + ronde}>{ronde}</label>
            </li>
        {/each}
    </ul-->

  <div>
    <h2 class="igs-legend-title">Intergemeentelijke samenwerkingsverbanden</h2>
    <br />
    <svg width="200" height="24">
      <rect
        x="0"
        y="0"
        width="67"
        height="24"
        fill="#F3BA93"
        stroke="#FFFFFF"
        stroke-width="1"
      />
      <rect
        x="67"
        y="0"
        width="67"
        height="24"
        fill="#EBE3D7"
        stroke="#FFFFFF"
        stroke-width="1"
      />
      <rect
        x="134"
        y="0"
        width="67"
        height="24"
        fill="#9BE3BF"
        stroke="#FFFFFF"
        stroke-width="1"
      />
    </svg>
  </div>
  <input
    class="styled-checkbox"
    id={"styled-checkbox-regios"}
    type="checkbox"
    bind:checked={showRegios}
  />
  <label for={"styled-checkbox-regios"}>Referentieregio's</label>
</div>

<style>
  .marker-filter-container {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(255, 255, 255, 0.7);
    padding: 5px;
    border-radius: 2px;
    max-width: 200px;
  }
  .marker-filter-container h2 {
    font-size: 16px;
    margin: 2px 0px 4px 0px;
  }
  .marker-filter-container h2.igs-legend-title {
    margin: 4px 0px -16px 0px;
  }
  .unstyled {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  li {
    margin: 6px 0;
  }
  .styled-checkbox {
    position: absolute;
    opacity: 0;
  }
  .styled-checkbox + label {
    position: relative;
    cursor: pointer;
  }
  .styled-checkbox + label:before {
    content: "";
    margin-right: 10px;
    display: inline-block;
    vertical-align: text-bottom;
    width: 18px;
    height: 18px;
    background: white;
  }
  .styled-checkbox + label:before {
    border: 1px black solid;
  }
  .styled-checkbox:checked + label:before {
    background: #000000;
  }
  .styled-checkbox:disabled + label {
    color: #b8b8b8;
    cursor: auto;
  }
  .styled-checkbox:disabled + label:before {
    box-shadow: none;
    background: #ddd;
  }
  .styled-checkbox:checked + label:after {
    content: "";
    position: absolute;
    left: 4px;
    top: 6px;
    background: white;
    width: 3px;
    height: 3px;
    box-shadow: 2px 0 0 white, 4px 0 0 white, 4px -2px 0 white, 4px -4px 0 white,
      4px -6px 0 white, 4px -8px 0 white;
    transform: rotate(45deg);
  }
  input#slider {
    width: 100%;
  }
  input[type=range] {
  height: 29px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: #000000;
  border-radius: 5px;
  border: 1px solid #CCCCCC;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 1px 1px 2px #000000;
  border: 2px solid #FFFFFF;
  height: 20px;
  width: 20px;
  border-radius: 20px;
  background: #000000;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7.5px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #000000;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: #000000;
  border-radius: 5px;
  border: 1px solid #CCCCCC;
}
input[type=range]::-moz-range-thumb {
  box-shadow: 1px 1px 2px #000000;
  border: 2px solid #FFFFFF;
  height: 20px;
  width: 20px;
  border-radius: 20px;
  background: #000000;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #000000;
  border: 1px solid #CCCCCC;
  border-radius: 10px;
  box-shadow: 0px 0px 0px #000000;
}
input[type=range]::-ms-fill-upper {
  background: #000000;
  border: 1px solid #CCCCCC;
  border-radius: 10px;
  box-shadow: 0px 0px 0px #000000;
}
input[type=range]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 1px 1px 2px #000000;
  border: 2px solid #FFFFFF;
  height: 20px;
  width: 20px;
  border-radius: 20px;
  background: #000000;
  cursor: pointer;
}
input[type=range]:focus::-ms-fill-lower {
  background: #000000;
}
input[type=range]:focus::-ms-fill-upper {
  background: #000000;
}

</style>
