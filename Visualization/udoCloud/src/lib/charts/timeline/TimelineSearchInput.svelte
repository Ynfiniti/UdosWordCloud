<script lang="ts">
  export let value: string = ""
  export let forTopic: boolean = false

</script>

<label for="value">searchstring</label>
<input id="value" type="search" bind:value={value}>

<label for="forTopic">Search for topics</label>
<input id="forTopic" type="checkbox" bind:checked={forTopic}>
