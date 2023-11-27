import {writable} from "svelte/store";
import type {DBCloudElement, DBTimelineElement} from "$lib/database/dbTypes";
import type {CloudSearchInputs} from "$lib/charts/cloud/cloudTypes";
import type {TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";
import {createDBCloud, createDBTimeline} from "$lib/database/fileUtils.js"

function createDBStore() {
  const {subscribe, update} = writable({
    cloud: [] as Array<DBCloudElement>,
    timeline: [] as Array<DBTimelineElement>
  })

  const loadNewData = (searchInput: CloudSearchInputs | TimelineSearchInputs, fromTimeline = false) => {
    if (fromTimeline) {
      update((d) => {
        return {
          cloud: d.cloud,
          timeline: createDBTimeline(searchInput as TimelineSearchInputs)
        }
      })
    } else {
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