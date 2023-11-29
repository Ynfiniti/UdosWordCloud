import type {RequestEvent} from '@sveltejs/kit'
import {json} from '@sveltejs/kit'
import {createDBTimeline} from "$lib/server/fileUtils.js"

// /api/newsletter GET

export async function GET(event: RequestEvent) {
  const value: string = event.url.searchParams.get("value") || ""
  const forTopic: boolean = event.url.searchParams.get("forTopic") === "true"

  console.log("for Timleine: ", value, forTopic)

  const ret = createDBTimeline({value, forTopic})

  return json(ret)
}