import type {ChartTabularData} from "@carbon/charts";
import type {WorldCloudChartOptions} from "@carbon/charts-svelte";

export type WordCloudProps = {
  data: ChartTabularData,
  options: WorldCloudChartOptions
}

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

export const DATE_MIN = "1852-01"