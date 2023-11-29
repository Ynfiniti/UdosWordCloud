<script lang="ts">
  import '@carbon/charts-svelte/styles.css'
  import {onMount} from 'svelte';
  import {loadingStore} from "$lib/charts/chartUtils";

  onMount(async () => {
    loadingStore.set(true)
    fetch("api/init").then((res) => {
      console.log("Files loaded: ", res)
      loadingStore.set(false)
    })
  });


</script>

<h1>Welcome to UdoCloud</h1>
<a href="/">Home</a>
<br>
<slot/>