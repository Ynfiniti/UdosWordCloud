<script lang="ts">
  export let value: string = ""
  export let forTopic: boolean = false

</script>

<style>
    label, button{
        margin-right: 1em;
    }
</style>

<div class="flex flex-row items-center">
	<label class="label">
		searchstring
		<input id="value" class="input h-8" type="search" bind:value={value}>
	</label>

	<label class="label flex flex-col">
		Search for Topic
		<input id="forTopic" class="checkbox mt-1" type="checkbox" bind:checked={forTopic}>
	</label>

	<slot></slot>
</div>
