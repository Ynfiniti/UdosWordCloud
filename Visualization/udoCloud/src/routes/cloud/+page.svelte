<script lang="ts">
    import {page} from "$app/stores";
    import {goto} from '$app/navigation';
    import {onMount} from "svelte";
    import type {ChartTabularData, WordCloudChart as WordCloudChartCore} from '@carbon/charts'
    import {WordCloudChart} from "@carbon/charts-svelte";
    import {
        type CloudSearchInputs,
        DATE_MIN,
        type WordCloudEvent,
        type WordCloudProps
    } from "$lib/charts/cloud/cloudTypes";
    import CloudSearchInput from "$lib/charts/cloud/CloudSearchInput.svelte";
    import {dbStore} from "$lib/database/dbStore";
    import {loadingStore} from "$lib/charts/chartUtils";
    import {wordCloudProps} from "$lib/charts/cloud/cloudUtils";
		import LoadingContainer from '$lib/LoadingContainer.svelte';

    /**
     * Inits for SearchInput
     */
    let initialValues = {
        initialDateMin: $page.url.searchParams.get('dateMin') || DATE_MIN,
        initialDateMax: $page.url.searchParams.get('dateMax') || "",
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

    const wordCloudData: WordCloudProps = wordCloudProps

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
        let newData: ChartTabularData = $dbStore.cloud as ChartTabularData || []
        wordCloudData.data = newData.map(d => {
                d["word"] = d["name"]
                d["value"] = d["amount"]
                d["group"] = d["amount"]
                delete d["name"]
                delete d["amount"]
                return d
            }
        )
        wordCloudData.options!.data!.loading = $loadingStore
    }
</script>

<CloudSearchInput {...initialValues} bind:searchInputs on:submit={searchInputSubmit}></CloudSearchInput>

<LoadingContainer>
	<WordCloudChart bind:chart {...wordCloudData}></WordCloudChart>
</LoadingContainer>
