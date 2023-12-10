import {replaceGroupText} from "$lib/charts/chartUtils";
import type {ChartTabularData} from "@carbon/charts";
import type {WordCloudProps} from "$lib/charts/cloud/cloudTypes";
import type {ChartTheme} from "@carbon/charts-svelte";

export const wordCloudProps: WordCloudProps = {
    options: {
        title: "Word cloud",
        resizable: true,
        height: "600px",
        theme: "white" as ChartTheme,
        animations: true,
        legend: {enabled: false},
        tooltip: {
            enabled: true,
            customHTML: (_, defaultHTML) => {
                return defaultHTML.replace(replaceGroupText, "Click to view Timeline")
            }
        },
        data: {
            loading: false
        }
    },
    data: [] as ChartTabularData
}