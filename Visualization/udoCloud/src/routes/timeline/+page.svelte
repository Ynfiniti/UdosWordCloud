<script lang="ts">
    import { page } from '$app/stores';
    import type {TimelineSearchInputs} from "$lib/SearchInput/timeline/timelineSearchInputTypes";
    import TimelineSearchInput from "$lib/SearchInput/timeline/TimelineSearchInput.svelte";

    const initialSearch = {
        initialValue: $page.url.searchParams.get('value') || "",
        initialForTopic: $page.url.searchParams.get('forTopic') === "true"
    }

    console.log(initialSearch)

    function searchInputSubmit(e: CustomEvent<TimelineSearchInputs>){
        console.log("Submitted lmao", e.detail)
    }
</script>

<TimelineSearchInput {...initialSearch} on:submit={searchInputSubmit}></TimelineSearchInput>