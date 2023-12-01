import type {ChartTabularData} from "@carbon/charts";
import type {LineChartOptions} from "@carbon/charts-svelte";
import type {DBTimelineDataElement} from "$lib/database/dbTypes";

export type LineChartProps = {
    data: ChartTabularData,
    options: LineChartOptions
}

export type LineChartEvent = {
    datum: DBTimelineDataElement,
    element: Selection,
    event: PointerEvent
}

export interface TimelineSearchInputs {
    value: string
    forTopic: boolean
}