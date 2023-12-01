<script lang="ts">
    import '@carbon/charts-svelte/styles.css'
    import {onMount} from 'svelte';
    import {loadingStore} from "$lib/charts/chartUtils";

    onMount(async () => {
        loadingStore.set(true)
        fetch("api/data").then((res) => {
            res.json().then(j => {
                console.log("Files loaded: ", j)
                loadingStore.set(false)
            })
        })
    });


</script>

<h1>Welcome to UdoCloud</h1>
<a href="/">Home</a>
<br>
<slot/>