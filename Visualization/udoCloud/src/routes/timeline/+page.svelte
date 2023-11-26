<script lang="ts">
  import {page} from '$app/stores';
  import type {TimelineSearchInputs} from "$lib/SearchInput/timeline/timelineSearchInputTypes";
  import TimelineSearchInput from "$lib/SearchInput/timeline/TimelineSearchInput.svelte";
  import type {LineChartOptions, ScaleTypes} from "@carbon/charts-svelte";
  import {LineChart} from "@carbon/charts-svelte";
  import type {ChartTabularData} from "@carbon/charts";
  import {loadingStore, removeGroupLI} from "$lib/charts/chartUtils";
  import {dbStore} from "$lib/database/dbStore";

  type LineChartProps = {
    data: ChartTabularData,
    options: LineChartOptions
  }

  const initialSearch = {
    initialValue: $page.url.searchParams.get('value') || "",
    initialForTopic: $page.url.searchParams.get('forTopic') === "true"
  }

  /**
   * TODO list of hrefs for selected day.
   * Select via onclick??
   * Update chart properly
   */

  loadingStore.set(true)

  dbStore.subscribe(({timeline}) => {
    console.log("This should update", timeline)
    loadingStore.set(false)
  })

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
      }
    },
    data: [] as ChartTabularData
  }

  $: {
    lineCharData.data = $dbStore.timeline
    lineCharData.options!.data!.loading = $loadingStore
    console.log("Set new timelineData", lineCharData.data)
  }

  console.log(initialSearch)

  function searchInputSubmit(e
                               :
                               CustomEvent<TimelineSearchInputs>
  ) {
    loadingStore.set(true)
    console.log("Submitted lmao", e.detail)
    dbStore.loadNewData(e.detail, true)
  }
</script>

<TimelineSearchInput {...initialSearch} on:submit={searchInputSubmit}></TimelineSearchInput>

<LineChart {...lineCharData}/>