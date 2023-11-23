<script lang="ts">
    import { onMount } from 'svelte';
    import {init, createDBTimeline} from "$lib/database/fileUtils.js"

    onMount(async () => {
        await init()
        const tokens = createDBTimeline("blames", false)
        const topics = createDBTimeline("united states", true)
        console.log(tokens)
        console.log(topics)
    });



</script>

<h1>Welcome to UdoCloud</h1>

<slot />