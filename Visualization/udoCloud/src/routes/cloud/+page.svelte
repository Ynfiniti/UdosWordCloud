<script lang="ts">
  import { page } from "$app/stores";
  import type { CloudSearchInputs } from "$lib/SearchInput/cloud/cloudSearchInputTypes";
  import CloudSearchInput from "$lib/SearchInput/cloud/CloudSearchInput.svelte";
  import { dbStore } from "$lib/database/dbStore";

    let initialValues= {
      initialDateMin: $page.url.searchParams.get('dateMin') || "1852-01",
      initialDateMax: $page.url.searchParams.get('dateMax') || "2001-09",
      initialForTopic: $page.url.searchParams.get('forTopic') == "false",
    }

    $: console.log($dbStore)

    function searchInputSubmit(e: CustomEvent<CloudSearchInputs>){
      dbStore.loadNewData(e.detail, false)
      console.log("Submit", e.detail)
    }

</script>

<CloudSearchInput {...initialValues} on:submit={searchInputSubmit}></CloudSearchInput>

<ul>
    {#each $dbStore["cloud"] as {name, amount} }
        <li>
            <p>{name} ({amount})</p>
        </li>
    {/each}
</ul>