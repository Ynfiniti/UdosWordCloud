import type {ChartTabularData} from "@carbon/charts";
import type {WorldCloudChartOptions} from "@carbon/charts-svelte";

export type WordCloudProps = {
    data: ChartTabularData,
    options: WorldCloudChartOptions
}

/**
 * Type of the event object received when a word bubble is clicked
 */
export type WordCloudEvent = {
    datum: {
        group: number,
        text: string,
        value: number
    },
    element: Selection,
    event: PointerEvent
}

export interface CloudSearchInputs {
    dateMin: string
    dateMax: string
    forTopic: boolean
}

export const DATE_MIN = "1852-01-01"