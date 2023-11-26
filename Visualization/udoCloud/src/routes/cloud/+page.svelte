<script lang="ts">
    import type {ChartTabularData} from '@carbon/charts'
    import type {WorldCloudChartOptions} from "@carbon/charts-svelte";
    import {WordCloudChart} from "@carbon/charts-svelte";
    import {page} from "$app/stores";
    import type {CloudSearchInputs} from "$lib/SearchInput/cloud/cloudSearchInputTypes";
    import CloudSearchInput from "$lib/SearchInput/cloud/CloudSearchInput.svelte";
    import {dbStore} from "$lib/database/dbStore";
    import {loadingStore, replaceGroupText} from "$lib/charts/chartUtils";

    /**
     * Check this out
     * https://www.npmjs.com/package/@carbon/charts-svelte#event-listeners
     */

    /**
     * TODO go to timeline of word when cloud element is
     * Update chart properly
     */

    type WordCloudProps = {
        data: ChartTabularData,
        options: WorldCloudChartOptions
    }

    loadingStore.set(true)

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
            data:{
                loading: false
            },
        },
        data: [] as ChartTabularData
    }

    $:{
        const newData = $dbStore.cloud
        const limit = newData.length >= 50? 50: newData.length
        wordCloudData.data = newData.sort((a, b) => b.value - a.value).splice(0, limit)
        wordCloudData.options!.data!.loading = $loadingStore
        console.log("Set new wordCloudData", wordCloudData.data)
    }

    let initialValues = {
        initialDateMin: $page.url.searchParams.get('dateMin') || "1852-01",
        initialDateMax: $page.url.searchParams.get('dateMax') || "2001-09",
        initialForTopic: $page.url.searchParams.get('forTopic') == "false",
    }

    dbStore.subscribe(() => {
        loadingStore.set(false)
    })

    function searchInputSubmit(e: CustomEvent<CloudSearchInputs>) {
        console.log("Submit", e.detail)
        loadingStore.set(true)
        dbStore.loadNewData(e.detail, false)
    }

</script>

<CloudSearchInput {...initialValues} on:submit={searchInputSubmit}></CloudSearchInput>

<WordCloudChart {...wordCloudData}></WordCloudChart>