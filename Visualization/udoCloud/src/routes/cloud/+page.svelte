<script lang="ts">
  import {page} from "$app/stores";
  import type {CloudSearchInputs} from "$lib/SearchInput/cloud/cloudSearchInputTypes";
  import CloudSearchInput from "$lib/SearchInput/cloud/CloudSearchInput.svelte";


    let initialValues= {
      initialDateMin: $page.url.searchParams.get('dateMin') || "1852-01",
      initialDateMax: $page.url.searchParams.get('dateMax') || "2001-09",
      initialForTopic: $page.url.searchParams.get('forTopic') == "false",
    }

    function searchInputSubmit(e: CustomEvent<CloudSearchInputs>){
      console.log("Submit", e.detail)
    }

</script>

<CloudSearchInput {...initialValues} on:submit={searchInputSubmit}></CloudSearchInput>