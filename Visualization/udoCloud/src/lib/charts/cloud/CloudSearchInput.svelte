<script lang="ts">
      import {createEventDispatcher, onMount} from 'svelte';
      import type {CloudSearchInputs} from "$lib/charts/cloud/cloudTypes";
      import {DATE_MIN} from "$lib/charts/cloud/cloudTypes";

      export let initialDateMin: string = ""
      export let initialDateMax: string = ""
      export let initialForTopic: boolean = false

      const dispatch = createEventDispatcher();

      onMount(async () => {
            if (initialDateMin || initialDateMax)
              submit()
      })

      /**
       * TODO monthpicker -> datepicker
       */

      export let searchInputs: CloudSearchInputs = {
        dateMin: initialDateMin,
        dateMax: initialDateMax,
        forTopic: initialForTopic
      }

      function submit() {
        dispatch("submit", searchInputs)
      }
</script>

<label for="datemin">start</label>
<input id="datemin" type="date" min="{DATE_MIN}" bind:value={searchInputs.dateMin}>

<label for="datemax">end</label>
<input id="datemax" type="date" min="{searchInputs.dateMin}" bind:value={searchInputs.dateMax}>

<label for="forTopic">Search for topics</label>
<input id="forTopic" type="checkbox" bind:checked={searchInputs.forTopic}>

<button on:click={submit}>Submit</button>