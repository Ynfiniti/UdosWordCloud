import type {ChartTabularData} from "@carbon/charts";
import type {LineChartOptions} from "@carbon/charts-svelte";
import type {DBTimelineElement} from "$lib/database/dbTypes";

export type LineChartProps = {
  data: ChartTabularData,
  options: LineChartOptions
}

export type LineChartEvent = {
  datum: DBTimelineElement,
  element: Selection,
  event: PointerEvent
}

export interface TimelineSearchInputs{
  value: string
  forTopic: boolean
}