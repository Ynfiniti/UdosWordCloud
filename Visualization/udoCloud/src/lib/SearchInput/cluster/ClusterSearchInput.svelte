<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { ClusterSearchInputs } from "$lib/SearchInput/cluster/clusterSearchInputTypes";

    const dispatch = createEventDispatcher();

    let searchInputs: ClusterSearchInputs = {
        dateMin: "1852-01",
        dateMax: "2001-09",
        forTopic: false
    }

    $: console.log(searchInputs)

    function submit(){
        dispatch("submit", searchInputs)
    }
</script>

<label for="datemin">start</label>
<input id="datemin" type="month" min="1852-01" bind:value={searchInputs.dateMin}>

<label for="datemax">end</label>
<input id="datemax" type="month" min="{searchInputs.dateMin}" bind:value={searchInputs.dateMax}>

<input id="forTopic" type="checkbox" bind:checked={searchInputs.forTopic}>

<button on:click={submit}>Submit</button>