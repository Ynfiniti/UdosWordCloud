import {writable} from "svelte/store";
import type {DBTimelineElement} from "$lib/database/dbTypes";
import type {ChartTabularData} from "@carbon/charts";
import type {LineChartOptions, WorldCloudChartOptions} from "@carbon/charts-svelte";

function createLoadingStore(){
    const { subscribe, set } = writable(false)

    return{
        subscribe,
        set
    }
}

export const replaceGroupText = "Group"

export const removeGroupLI = "<li>\n" +
  "\t\t\t\t\t<div class=\"datapoint-tooltip\">\n" +
  "\t\t\t\t\t\t<div class=\"tooltip-color tooltip-1-1-1\"></div>\n" +
  "\t\t\t\t\t\t<div class=\"label\">\n" +
  "\t\t\t\t\t\t<p>Group</p>\n" +
  "\t\t\t\t\t\t\n" +
  "\t\t\t\t\t\t</div>\n" +
  "\t\t\t\t\t\t\n" +
  "\t\t\t\t\t</div>\n" +
  "\t\t\t\t</li>"

export const loadingStore = createLoadingStore()