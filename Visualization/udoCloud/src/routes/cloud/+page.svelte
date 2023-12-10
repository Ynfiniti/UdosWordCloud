<script lang="ts">
    import {page} from "$app/stores";
    import {goto} from '$app/navigation';
    import {onMount} from "svelte";
    import type {ChartTabularData, WordCloudChart as WordCloudChartCore} from '@carbon/charts'
    import {WordCloudChart} from "@carbon/charts-svelte";
    import type {CloudSearchInputs, WordCloudEvent, WordCloudProps} from "$lib/charts/cloud/cloudTypes";
    import CloudSearchInput from "$lib/charts/cloud/CloudSearchInput.svelte";
    import {dbStore} from "$lib/database/dbStore";
    import {loadingStore} from "$lib/charts/chartUtils";
    import {wordCloudProps} from "$lib/charts/cloud/cloudUtils";

    /**
     * Inits for SearchInput
     */
    let initialValues = {
        initialDateMin: $page.url.searchParams.get('dateMin') || "1852-01-01",
        initialDateMax: $page.url.searchParams.get('dateMax') || "2001-09-30",
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

    function onUpdate(e: CustomEvent<any>) {
        console.log(e)
    }

    dbStore.subscribe(() => {
        loadingStore.set(false)
    })

    // Gets executed everytime dbStore and loadingStore change
    $:{
        let newData: ChartTabularData = $dbStore.cloud as ChartTabularData || []
        wordCloudData.data = newData.map(d => {
                d["word"] = d["name"]
                d["value"] = parseFloat(d["amount"])
                d["group"] = d["amount"]
                delete d["name"]
                delete d["amount"]
                return d
            }
        )
        wordCloudData.options!.data!.loading = $loadingStore
    }

    const other = {
        data: [
            {
                "word": "Lorem",
                "value": 52,
                "group": "Second"
            },
            {
                "word": "ipsum",
                "value": 25,
                "group": "Second"
            },
            {
                "word": "dolor",
                "value": 51,
                "group": "Second"
            },
            {
                "word": "amet",
                "value": 40,
                "group": "First"
            },
            {
                "word": "consectetur",
                "value": 25,
                "group": "Fourth"
            },
            {
                "word": "adipiscing",
                "value": 36,
                "group": "Fourth"
            },
            {
                "word": "elit",
                "value": 40,
                "group": "First"
            },
            {
                "word": "Duis",
                "value": 18,
                "group": "First"
            },
            {
                "word": "dapibus",
                "value": 49,
                "group": "Third"
            },
            {
                "word": "urna",
                "value": 18,
                "group": "First"
            },
            {
                "word": "tellus",
                "value": 54,
                "group": "Second"
            },
            {
                "word": "placerat",
                "value": 57,
                "group": "Third"
            },
            {
                "word": "leo",
                "value": 18,
                "group": "First"
            },
            {
                "word": "semper",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "venenatis",
                "value": 43,
                "group": "Fourth"
            },
            {
                "word": "Vestibulum",
                "value": 50,
                "group": "Fourth"
            },
            {
                "word": "imperdiet",
                "value": 30,
                "group": "Fourth"
            },
            {
                "word": "erat",
                "value": 18,
                "group": "First"
            },
            {
                "word": "auctor",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "purus",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "ullamcorper",
                "value": 18,
                "group": "Fourth"
            },
            {
                "word": "porta",
                "value": 52,
                "group": "Second"
            },
            {
                "word": "Pellentesque",
                "value": 40,
                "group": "Fourth"
            },
            {
                "word": "porta",
                "value": 39,
                "group": "Second"
            },
            {
                "word": "aliquam",
                "value": 18,
                "group": "Third"
            },
            {
                "word": "est",
                "value": 18,
                "group": "First"
            },
            {
                "word": "bibendum",
                "value": 46,
                "group": "Third"
            },
            {
                "word": "lorem",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "Morbi",
                "value": 46,
                "group": "Second"
            },
            {
                "word": "dui",
                "value": 18,
                "group": "First"
            },
            {
                "word": "non",
                "value": 42,
                "group": "First"
            },
            {
                "word": "neque",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "semper",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "aliquam",
                "value": 34,
                "group": "Third"
            },
            {
                "word": "mollis",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "sapien",
                "value": 39,
                "group": "Second"
            },
            {
                "word": "Interdum",
                "value": 18,
                "group": "Third"
            },
            {
                "word": "malesuada",
                "value": 18,
                "group": "Fourth"
            },
            {
                "word": "fames",
                "value": 41,
                "group": "Second"
            },
            {
                "word": "ante",
                "value": 18,
                "group": "First"
            },
            {
                "word": "ipsum",
                "value": 53,
                "group": "Second"
            },
            {
                "word": "primis",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "faucibus",
                "value": 29,
                "group": "Third"
            },
            {
                "word": "Fusce",
                "value": 20,
                "group": "Second"
            },
            {
                "word": "magna",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "quis",
                "value": 35,
                "group": "First"
            },
            {
                "word": "arcu",
                "value": 46,
                "group": "First"
            },
            {
                "word": "aliquet",
                "value": 18,
                "group": "Third"
            },
            {
                "word": "porttitor",
                "value": 18,
                "group": "Fourth"
            },
            {
                "word": "amet",
                "value": 18,
                "group": "First"
            },
            {
                "word": "nisl",
                "value": 51,
                "group": "First"
            },
            {
                "word": "Praesent",
                "value": 34,
                "group": "Third"
            },
            {
                "word": "varius",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "sit",
                "value": 58,
                "group": "First"
            },
            {
                "word": "amet",
                "value": 18,
                "group": "First"
            },
            {
                "word": "turpis",
                "value": 24,
                "group": "Second"
            },
            {
                "word": "non",
                "value": 47,
                "group": "First"
            },
            {
                "word": "finibus",
                "value": 18,
                "group": "Third"
            },
            {
                "word": "Pellentesque",
                "value": 48,
                "group": "Fourth"
            },
            {
                "word": "habitant",
                "value": 27,
                "group": "Third"
            },
            {
                "word": "morbi",
                "value": 19,
                "group": "Second"
            },
            {
                "word": "tristique",
                "value": 18,
                "group": "Fourth"
            },
            {
                "word": "senectus",
                "value": 43,
                "group": "Third"
            },
            {
                "word": "netus",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "malesuada",
                "value": 18,
                "group": "Fourth"
            },
            {
                "word": "fames",
                "value": 37,
                "group": "Second"
            },
            {
                "word": "turpis",
                "value": 24,
                "group": "Second"
            },
            {
                "word": "egestas",
                "value": 18,
                "group": "Third"
            },
            {
                "word": "Aliquam",
                "value": 45,
                "group": "Third"
            },
            {
                "word": "erat",
                "value": 18,
                "group": "First"
            },
            {
                "word": "volutpat",
                "value": 57,
                "group": "Third"
            },
            {
                "word": "Aliquam",
                "value": 18,
                "group": "Third"
            },
            {
                "word": "dapibus",
                "value": 42,
                "group": "Third"
            },
            {
                "word": "urna",
                "value": 36,
                "group": "First"
            },
            {
                "word": "vehicula",
                "value": 19,
                "group": "Third"
            },
            {
                "word": "Quisque",
                "value": 18,
                "group": "Third"
            },
            {
                "word": "convallis",
                "value": 25,
                "group": "Fourth"
            },
            {
                "word": "finibus",
                "value": 18,
                "group": "Third"
            },
            {
                "word": "felis",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "quis",
                "value": 22,
                "group": "First"
            },
            {
                "word": "aliquam",
                "value": 18,
                "group": "Third"
            },
            {
                "word": "massa",
                "value": 55,
                "group": "Second"
            },
            {
                "word": "sagittis",
                "value": 18,
                "group": "Third"
            },
            {
                "word": "Nam",
                "value": 32,
                "group": "First"
            },
            {
                "word": "ipsum",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "orci",
                "value": 38,
                "group": "First"
            },
            {
                "word": "ornare",
                "value": 18,
                "group": "Second"
            },
            {
                "word": "non",
                "value": 18,
                "group": "First"
            },
            {
                "word": "arcu",
                "value": 32,
                "group": "First"
            },
            {
                "word": "consequat",
                "value": 55,
                "group": "Fourth"
            },
            {
                "word": "tempus",
                "value": 23,
                "group": "Second"
            },
            {
                "word": "lobortis",
                "value": 47,
                "group": "Third"
            },
            {
                "word": "magna",
                "value": 18,
                "group": "Second"
            }
        ],
        options: {
            "title": "Word cloud",
            "resizable": true,
            "color": {
                "pairing": {
                    "option": 3
                }
            },
            "height": "400px",
            "theme": "g100"
        }
    }
</script>

<CloudSearchInput {...initialValues} bind:searchInputs on:submit={searchInputSubmit}></CloudSearchInput>

<WordCloudChart bind:chart on:update={onUpdate} {...wordCloudData}></WordCloudChart>