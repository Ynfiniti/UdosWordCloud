<script lang="ts">
  import type {TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";

  export let initialValue: string = ""
    export let initialForTopic: boolean = false


    let searchInputs: TimelineSearchInputs = {
        value: initialValue,
        forTopic: initialForTopic
    }

</script>

<label for="value">searchstring</label>
<input id="value" type="search" bind:value={searchInputs.value}>

<label for="forTopic">Search for topics</label>
<input id="forTopic" type="checkbox" bind:checked={searchInputs.forTopic}>
