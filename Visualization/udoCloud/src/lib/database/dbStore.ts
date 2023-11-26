import {writable} from "svelte/store";
import type {DBCloud, DBTimeline} from "$lib/database/dbTypes";
import type {CloudSearchInputs} from "$lib/SearchInput/cloud/cloudSearchInputTypes";
import type {TimelineSearchInputs} from "$lib/SearchInput/timeline/timelineSearchInputTypes";
import {createDBTimeline, createDBCloud} from "$lib/database/fileUtils.js"

function createDBStore() {
    const {subscribe, update} = writable({
        cloud: [] as Array<DBCloud>,
        timeline: {} as DBTimeline
    })

    const loadNewData = (searchInput: CloudSearchInputs | TimelineSearchInputs, fromTimeline = false) => {
        if (fromTimeline) {
            update((d) => ({
                cloud: d.cloud,
                timeline: createDBTimeline(searchInput as TimelineSearchInputs)
            }))
        } else {
            console.log("Should be new data?: ", createDBCloud(searchInput as CloudSearchInputs),)
            update(d => {
                return {
                    cloud: createDBCloud(searchInput as CloudSearchInputs),
                    timeline: d.timeline
                }
            })
        }
    }

    return {
        subscribe,
        loadNewData
    }
}

export const dbStore = createDBStore()