<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    function submit() {
      dispatch("submit", searchInputs)
    }
</script>


<button on:click={submit}>Submit</button>