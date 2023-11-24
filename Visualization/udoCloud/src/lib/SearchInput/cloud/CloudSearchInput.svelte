<script lang="ts">
      import {createEventDispatcher, onMount} from 'svelte';
      import type {CloudSearchInputs} from "$lib/SearchInput/cloud/cloudSearchInputTypes";

      export let initialDateMin = "1852-01"
      export let initialDateMax = "2001-09"
      export let initialForTopic = false

      const dispatch = createEventDispatcher();

      onMount(async () => {
            if (initialDateMin || initialDateMax)
              submit()
      })

      let searchInputs: CloudSearchInputs = {
        dateMin: initialDateMin,
        dateMax: initialDateMax,
        forTopic: initialForTopic
      }

      $: console.log(searchInputs)

      function submit() {
        dispatch("submit", searchInputs)
      }
</script>

<label for="datemin">start</label>
<input id="datemin" type="month" min="1852-01" bind:value={searchInputs.dateMin}>

<label for="datemax">end</label>
<input id="datemax" type="month" min="{searchInputs.dateMin}" bind:value={searchInputs.dateMax}>

<input id="forTopic" type="checkbox" bind:checked={searchInputs.forTopic}>

<button on:click={submit}>Submit</button>