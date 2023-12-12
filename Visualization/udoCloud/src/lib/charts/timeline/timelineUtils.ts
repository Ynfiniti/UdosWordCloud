import {Alignments, type ScaleTypes} from "@carbon/charts-svelte";
import {type ChartTabularData, ZoomBarTypes} from "@carbon/charts";
import type {LineChartProps} from "$lib/charts/timeline/timelineTypes";

export const lineChartProps: LineChartProps = {
    options: {
        animations: true,
        legend: {
            enabled: true,
            alignment: Alignments.CENTER
        },
        tooltip: {
            enabled: true
        },
        zoomBar: {
            top: {
                enabled: true,
                type: ZoomBarTypes.SLIDER_VIEW
            }
        },
        data: {
            loading: false
        },
        axes: {
            bottom: {
                title: "Dates",
                mapsTo: "date",
                scaleType: "time" as ScaleTypes
            },
            left: {
                mapsTo: "amount",
                title: "Occurrences",
                scaleType: "linear" as ScaleTypes
            }
        },
        height: "400px"
    },
    data: [] as ChartTabularData
}