<script lang="ts">
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

	<h1>
		<div id="header">
			<img src="/Udo.png" alt="Udo"/>
			Welcome to UdoCloud
		</div>
	</h1>
<a href="/">Home</a>
<br>
<slot/>