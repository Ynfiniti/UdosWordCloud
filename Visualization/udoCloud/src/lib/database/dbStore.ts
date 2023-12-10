import {writable} from "svelte/store";
import type {DBCloudElement, DBTimelineElement} from "$lib/database/dbTypes";
import type {CloudSearchInputs} from "$lib/charts/cloud/cloudTypes";
import type {TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";

async function loadTimeline(searchInput: Array<TimelineSearchInputs>) {
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
    return timelineArr
}

async function loadWordCloud(searchInput: CloudSearchInputs){
    const res = await fetch(`/api/cloud?dateMax=${searchInput.dateMax}&dateMin=${searchInput.dateMin}&forTopic=${searchInput.forTopic}`)
    return await res.json()
}

function createDBStore() {
    const {subscribe, update} = writable({
        cloud: [] as Array<DBCloudElement>,
        timeline: [] as Array<DBTimelineElement>
    })

    const loadNewData = async (searchInput: CloudSearchInputs | Array<TimelineSearchInputs>, fromTimeline = false) => {
        if (fromTimeline) {
            loadTimeline(searchInput as Array<TimelineSearchInputs>)
                .then(timelineArr => setNewData(timelineArr, true))
        } else {
            loadWordCloud(searchInput as CloudSearchInputs)
                .then(wordCloud => setNewData(wordCloud, false))
        }
    }

    const setNewData = (data: Array<DBCloudElement> | Array<DBTimelineElement>, forTimeline = false) => {
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