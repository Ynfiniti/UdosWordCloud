<script lang="ts">
  import {page} from "$app/stores";
  import {goto} from '$app/navigation';
  import {onMount} from "svelte";
  import type {ChartTabularData, WordCloudChart as WordCloudChartCore} from '@carbon/charts'
  import {WordCloudChart} from "@carbon/charts-svelte";
  import type {CloudSearchInputs, WordCloudEvent, WordCloudProps} from "$lib/charts/cloud/cloudTypes";
  import CloudSearchInput from "$lib/charts/cloud/CloudSearchInput.svelte";
  import {dbStore} from "$lib/database/dbStore";
  import {loadingStore, replaceGroupText} from "$lib/charts/chartUtils";

  /**
   * Inits for SearchInput
   */
  let initialValues = {
    initialDateMin: $page.url.searchParams.get('dateMin') || "1852-01",
    initialDateMax: $page.url.searchParams.get('dateMax') || "2001-09",
    initialForTopic: $page.url.searchParams.get('forTopic') == "false",
  }

  let searchInputs: CloudSearchInputs

  function searchInputSubmit(e: CustomEvent<CloudSearchInputs>) {
    loadingStore.set(true)
    dbStore.loadNewData(e.detail, false)
  }

  /**
   * Inits for chart
   */

  let chart!: WordCloudChartCore;

  const wordCloudData: WordCloudProps = {
    options: {
      animations: true,
      legend: {enabled: false},
      tooltip: {
        enabled: true,
        customHTML: (_, defaultHTML) => {
          return defaultHTML.replace(replaceGroupText, "Click to view Timeline")
        }
      },
      data: {
        loading: false
      },
    },
    data: [] as ChartTabularData
  }

  onMount(async () => {
    loadingStore.set(true)
    chart.services.events.addEventListener("wordcloud-word-click", (e: CustomEvent<WordCloudEvent>) => {
      goto(`/timeline?value=${e.detail.datum.text}&forTopic=${searchInputs.forTopic}`)
    })
  });

  dbStore.subscribe(() => {
    loadingStore.set(false)
  })

  // Gets executed everytime dbStore and loadingStore change
  $:{
    const limit = $dbStore.cloud.length >= 100 ? 100 : $dbStore.cloud.length
    let newData: ChartTabularData
    try{
      newData = $dbStore.cloud.toSorted((a, b) => b.value - a.value).splice(0, limit) as ChartTabularData
    }
    catch(e){
      newData = []
    }
    wordCloudData.data = newData.map(d => {
        d["group"] = d["value"]
        return d
      }
    )
    wordCloudData.options!.data!.loading = $loadingStore
  }
</script>

<CloudSearchInput {...initialValues} bind:searchInputs on:submit={searchInputSubmit}></CloudSearchInput>

<WordCloudChart bind:chart {...wordCloudData}></WordCloudChart>