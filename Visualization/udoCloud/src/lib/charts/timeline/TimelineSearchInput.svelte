<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import type { TimelineSearchInputs } from "$lib/charts/timeline/timelineSearchInputTypes";

    export let initialValue: string = ""
    export let initialForTopic: boolean = false

    const dispatch = createEventDispatcher();

    onMount(async () => {
        if(initialValue)
            submit()
    })

    let searchInputs: TimelineSearchInputs = {
        value: initialValue,
        forTopic: initialForTopic
    }

    function submit(){
        dispatch("submit", searchInputs)
    }
</script>

<label for="value">searchstring</label>
<input id="value" type="search" bind:value={searchInputs.value}>

<input id="forTopic" type="checkbox" bind:checked={searchInputs.forTopic}>

<button on:click={submit}>Submit</button>