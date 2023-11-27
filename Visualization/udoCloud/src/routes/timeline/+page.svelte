<script lang="ts">
  import {page} from '$app/stores';
  import {onMount} from "svelte";
  import type {ScaleTypes} from "@carbon/charts-svelte";
  import {LineChart} from "@carbon/charts-svelte";
  import type {LineChartEvent, LineChartProps, TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";
  import TimelineSearchInput from "$lib/charts/timeline/TimelineSearchInput.svelte";
  import type {ChartTabularData, LineChart as LineChartCore} from "@carbon/charts";
  import {loadingStore, removeGroupLI} from "$lib/charts/chartUtils";
  import {dbStore} from "$lib/database/dbStore";
  import TimelineHrefList from "$lib/charts/timeline/TimelineHrefList.svelte";
  import type {Href} from "$lib/database/dbTypes";

  /**
   * Inits for SearchInput
   */
  const initialSearch = {
    initialValue: $page.url.searchParams.get('value') || "",
    initialForTopic: $page.url.searchParams.get('forTopic') === "true"
  }

  function searchInputSubmit(e: CustomEvent<TimelineSearchInputs>) {
    loadingStore.set(true)
    dbStore.loadNewData(e.detail, true)
  }

  /**
   * Inits for chart
   */

  let chart!: LineChartCore

  const lineCharData: LineChartProps = {
    options: {
      animations: true,
      legend: {enabled: false},
      tooltip: {
        enabled: true,
        customHTML: (_, defaultHTML) => {
          return defaultHTML.replace(removeGroupLI, "")
        }
      },
      data: {
        loading: false
      },
      axes: {
        bottom: {
          title: "Dates",
          mapsTo: "date",
          scaleType: "time" as ScaleTypes
        },
        left: {
          mapsTo: "amount",
          title: "Occurrences",
          scaleType: "linear" as ScaleTypes
        }
      },
      zoomBar: {
        top: {
          enabled: true
        }
      },
      height: "400px"
    },
    data: [] as ChartTabularData
  }

  /**
   * Init for href list
   */
  let selectedHrefs: Array<Href> = []

  onMount(async () => {
    loadingStore.set(true)

    chart.services.events.addEventListener("scatter-click", (e: CustomEvent<LineChartEvent>) => {
      console.log(e.detail.datum)
      selectedHrefs = e.detail.datum.hrefs
    })
  });

  dbStore.subscribe(() => {
    loadingStore.set(false)
  })

  // Gets executed every time dbStore and loadingStore change
  $: {
    selectedHrefs = []
    lineCharData.data = $dbStore.timeline
    lineCharData.options!.data!.loading = $loadingStore
  }
</script>

<TimelineSearchInput {...initialSearch} on:submit={searchInputSubmit}></TimelineSearchInput>

<LineChart bind:chart {...lineCharData}/>

<TimelineHrefList bind:initialHrefs={selectedHrefs}></TimelineHrefList>