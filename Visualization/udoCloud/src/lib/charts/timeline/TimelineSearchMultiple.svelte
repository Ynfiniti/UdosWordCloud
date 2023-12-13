<script lang="ts">
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
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
    }

    function del(i: number){
      searchInputs = searchInputs.filter((_, index) => index != i)
  }

    function submit() {
      dispatch("submit", searchInputs)
    }
</script>

<div class="flex flex-col h-60 overflow-y-scroll snap-mandatory snap-y">
    {#each searchInputs as input, index (input)}
        <div class="flex flex-row items-center align-middle snap-always snap-start" transition:fade>
            <TimelineSearchInput bind:value={input.value} bind:forTopic={input.forTopic}>
                <button id="del" class="btn btn-sm variant-filled-surface ml-5" on:click={() => del(index)}>x</button>
            </TimelineSearchInput>
        </div>
        <br/>
    {/each}
</div>


<button id="add" class="btn btn-sm variant-filled-secondary" on:click={add}>New</button>

<button class="btn btn-sm variant-filled-primary" on:click={submit}>Submit</button>
