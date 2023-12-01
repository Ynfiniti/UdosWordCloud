import type {RequestEvent} from '@sveltejs/kit'
import {json} from '@sveltejs/kit'
import {createDBTimeline} from "$lib/server/fileUtils.js"
import {getTimeline} from "$lib/server/dbConnection";

// /api/newsletter GET

export async function GET(event: RequestEvent) {
  const value: string = event.url.searchParams.get("value") || ""
  const forTopic: boolean = event.url.searchParams.get("forTopic") === "true"

  console.log("for Timleine: ", value, forTopic)

  getTimeline([{value: "sport", forTopic: false}]).then(({result, error}) => {
    console.log("From timeline, false")
    console.log(result)
    if(error) console.error(error.sqlMessage)
  })
  getTimeline([{value: "sport", forTopic: true}]).then(({result, error}) => {
    console.log("From timeline, true")
    console.log(result)
    if(error) console.error(error.sqlMessage)
  })

  const ret = createDBTimeline({value, forTopic})

  return json(ret)
}