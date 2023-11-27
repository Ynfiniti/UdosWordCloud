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

  const loadNewData = (searchInput: CloudSearchInputs | Array<TimelineSearchInputs>, fromTimeline = false) => {
    if (fromTimeline) {
      update((d) => {
        searchInput = searchInput as Array<TimelineSearchInputs>
        const timelineArr = searchInput.map(si => ({
          data: createDBTimeline(si),
          label: si.value,
          forTopic: si.forTopic
        }))
        return {
          cloud: d.cloud,
          timeline: timelineArr
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