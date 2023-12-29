import { replaceLastLiUl, tooltipExtension } from '$lib/charts/chartUtils';
import type { ChartTabularData } from '@carbon/charts';
import type { WordCloudProps } from '$lib/charts/cloud/cloudTypes';
import type { ChartTheme } from '@carbon/charts-svelte';

export const wordCloudProps: WordCloudProps = {
    options: {
        height: "600px",
        theme: "white" as ChartTheme,
        animations: true,
        legend: {enabled: false},
        tooltip: {
            enabled: true,
            customHTML: (_, defaultHTML) => {
                return defaultHTML
                  .replace(replaceLastLiUl, "")
                + tooltipExtension.replace("#1", "Click to view Timeline")

            }
        },
        data: {
            loading: true
        }
    },
    data: [] as ChartTabularData
}