<script lang="ts">
    import "../app.pcss";
    import '@carbon/charts-svelte/styles.css'
</script>

<style>
	#header{
			display: flex;
      align-items: center;
	}

	img{
			height: 2em;
	}
</style>

	<a class="h1" href="/">
		<div id="header">
			<img src="/Udo.png" alt="Udo">
			Welcome to UdoCloud
		</div>
	</a>

<br>

<slot></slot>