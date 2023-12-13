<script lang="ts">
    import {page} from '$app/stores';
    import {onMount} from "svelte";
    import {LineChart} from "@carbon/charts-svelte";
    import type {LineChartEvent, LineChartProps, TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";
    import type {ChartTabularData, LineChart as LineChartCore} from "@carbon/charts";
    import {loadingStore} from "$lib/charts/chartUtils";
    import {dbStore} from "$lib/database/dbStore";
    import TimelineHrefList from "$lib/charts/timeline/TimelineHrefList.svelte";
    import type {Href} from "$lib/database/dbTypes";
    import TimelineSearchMultiple from "$lib/charts/timeline/TimelineSearchMultiple.svelte";
    import {lineChartProps} from "$lib/charts/timeline/timelineUtils";
		import LoadingContainer from '$lib/LoadingContainer.svelte';

    /**
     * Inits for SearchInput
     */
    const initialSearch = {
        initialValue: $page.url.searchParams.get('value') || "",
        initialForTopic: $page.url.searchParams.get('forTopic') === "true"
    }

    function searchInputSubmit(e: CustomEvent<Array<TimelineSearchInputs>>) {
        loadingStore.set(true)
        dbStore.loadNewData(e.detail, true)
    }

    /**
     * Inits for chart
     */

    let chart!: LineChartCore

    const lineCharData: LineChartProps = lineChartProps

    /**
     * Init for href list
     */
    let selectedHrefs: Array<Href> = []

    onMount(async () => {
        loadingStore.set(true)

        chart.services.events.addEventListener("scatter-click", (e: CustomEvent<LineChartEvent>) => {
            selectedHrefs = e.detail.datum.hrefs
        })
    });

    dbStore.subscribe(() => {
        loadingStore.set(false)
    })

    // Gets executed every time dbStore and loadingStore change
    $: {
        selectedHrefs = []
        const newData = $dbStore.timeline as ChartTabularData || []
        lineCharData.data = newData.map(d => {
            d.data.map((e: { [key: string]: string }) => {
                e["group"] = `${d.label}, ${d.forTopic}`
                return e
            })
            return d.data
        }).flat()

        lineCharData.options!.data!.loading = $loadingStore
    }
</script>

<TimelineSearchMultiple {...initialSearch} on:submit={searchInputSubmit}></TimelineSearchMultiple>

<LoadingContainer>
	<LineChart bind:chart {...lineCharData}/>

	<TimelineHrefList bind:initialHrefs={selectedHrefs}></TimelineHrefList>
</LoadingContainer>
