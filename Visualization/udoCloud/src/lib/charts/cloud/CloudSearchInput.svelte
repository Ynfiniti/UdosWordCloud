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

      export let searchInputs: CloudSearchInputs = {
        dateMin: initialDateMin,
        dateMax: initialDateMax,
        forTopic: initialForTopic
      }

      function submit() {
        dispatch("submit", searchInputs)
      }
</script>

<style>
	label, button{
			margin-right: 1em;
	}
</style>

<div class="flex flex-wrap flex-row">
	<label class="label">
		start
		<input id="datemin" class="input" type="date" min="{DATE_MIN}" bind:value={searchInputs.dateMin}>
	</label>

	<label class="label">
		end
		<input id="datemax" class="input" type="date" min="{searchInputs.dateMin}" bind:value={searchInputs.dateMax}>
	</label>

	<label class="label flex flex-col">
		Search for topics
		<input id="forTopic" class="checkbox mt-2.5" type="checkbox" bind:checked={searchInputs.forTopic}>
	</label>
</div>

<button class="btn btn-sm variant-filled-primary mt-2.5" on:click={submit}>Submit</button>
