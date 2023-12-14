<script lang="ts">
	import '../app.pcss';
	import '@carbon/charts-svelte/styles.css';
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<style>
    img {
        height: 2em;
    }
</style>


<AppBar class="h1">
	<svelte:fragment slot="lead">
		<a href="/">
			<img src="/Udo.png" alt="Udo">
		</a>
	</svelte:fragment>
	Welcome to UdoCloud
</AppBar>

<br>

<div style="padding: 1em">
	<slot></slot>
</div>
