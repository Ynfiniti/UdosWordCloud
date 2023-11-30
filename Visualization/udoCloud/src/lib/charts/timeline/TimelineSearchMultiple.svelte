<script lang="ts">
  import {createEventDispatcher, onMount} from "svelte";
  import type {TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";
  import TimelineSearchInput from "$lib/charts/timeline/TimelineSearchInput.svelte";

  const dispatch = createEventDispatcher();

    export let initialValue: string = ""
    export let initialForTopic: boolean = false

    let searchInputs: Array<TimelineSearchInputs> = [{
      value: initialValue,
      forTopic: initialForTopic
    }]

    onMount(async () => {
      if (initialValue)
        submit()
    })

    function add(){
      searchInputs = [...searchInputs, {value: "", forTopic: false}]
      console.log("Adding new thing", searchInputs)
    }

    function del(i: number){
      searchInputs = searchInputs.filter((_, index) => index != i)
  }

    function submit() {
      console.log("submitting", searchInputs)
      dispatch("submit", searchInputs)
    }
</script>

{#each searchInputs as input, index (input)}
    <TimelineSearchInput bind:value={input.value} bind:forTopic={input.forTopic}></TimelineSearchInput>
    <button id="del" on:click={() => del(index)}>x</button>
    <br/>
{/each}

<button id="add" on:click={add}>New</button>

<button id="submit" on:click={submit}>Submit</button>