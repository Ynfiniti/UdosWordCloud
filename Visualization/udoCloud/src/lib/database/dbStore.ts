import {writable} from "svelte/store";
import type {DBCloudElement, DBTimelineElement} from "$lib/database/dbTypes";
import type {CloudSearchInputs} from "$lib/charts/cloud/cloudTypes";
import type {TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";

function createDBStore() {
    const {subscribe, update} = writable({
        cloud: [] as Array<DBCloudElement>,
        timeline: [] as Array<DBTimelineElement>
    })

    const loadNewData = async (searchInput: CloudSearchInputs | Array<TimelineSearchInputs>, fromTimeline = false) => {
        /**
         * TODO implement server api with database connection (or for now the filesUtils)
         * https://kit.svelte.dev/docs/server-only-modules#your-modules
         * https://joyofcode.xyz/sveltekit-loading-data#api-endpoints
         */
        if (fromTimeline) {
            searchInput = searchInput as Array<TimelineSearchInputs>
            const timelineArr: Array<DBTimelineElement> = []
            for (const si of searchInput) {
                const res = await fetch(`api/timeline?value=${si.value}&forTopic=${si.forTopic}`)
                const json = await res.json()
                timelineArr.push({
                    data: json,
                    label: si.value,
                    forTopic: si.forTopic
                })
            }
            setNewData(timelineArr, true)
        } else {
            searchInput = searchInput as CloudSearchInputs
            const res = await fetch(`/api/cloud?dateMax=${searchInput.dateMax}&dateMin=${searchInput.dateMin}&forTopic=${searchInput.forTopic}`)
            const json = await res.json()
            setNewData(json, false)
        }
    }

    const setNewData = (data: Array<DBCloudElement> | Array<DBTimelineElement>, forTimeline = false) => {
        console.log("Set new data", data, forTimeline)
        update(d => {
            return {
                cloud: !forTimeline ? data as Array<DBCloudElement> : d.cloud,
                timeline: forTimeline ? data as Array<DBTimelineElement> : d.timeline
            }
        })
    }

    return {
        subscribe,
        loadNewData,
        setNewData
    }
}

export const dbStore = createDBStore()