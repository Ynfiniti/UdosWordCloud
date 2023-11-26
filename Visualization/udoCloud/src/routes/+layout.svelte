<script lang="ts">
    import { onMount } from 'svelte';
    import {init, createDBTimeline} from "$lib/database/fileUtils.js"

    onMount(async () => {
        init().then((res) => console.log("Files loaded: ", res))
    });



</script>

<h1>Welcome to UdoCloud</h1>
<a href="/">Home</a>
<br>
<slot />