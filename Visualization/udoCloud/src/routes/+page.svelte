<script>
    import { onMount } from 'svelte';
    import { init, createDBCloud } from "$lib/fileUtils"

    onMount(async () => {
        await init()
        const tokens = createDBCloud("1963-01-00", "1963-10-32")
        const topics = createDBCloud("1963-01-00", "1963-10-32", true)
        console.log(tokens)
        console.log(topics)
    });


</script>

<h1>Welcome to UdoCloud</h1>

