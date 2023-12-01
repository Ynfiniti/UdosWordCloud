import type {RequestEvent} from '@sveltejs/kit'
import {json} from '@sveltejs/kit'
import {createDBCloud} from "$lib/server/fileUtils.js"
import {getCloud} from "$lib/server/dbConnection";

// /api/newsletter GET

export async function GET(event: RequestEvent) {
  const dateMax: string = event.url.searchParams.get("dateMax") || ""
  const dateMin: string = event.url.searchParams.get("dateMin") || ""
  const forTopic: boolean = event.url.searchParams.get("forTopic") === "true"

  console.log("for Cloud: ", dateMax, dateMin, forTopic)
  getCloud({dateMax: "1963-12-31", dateMin: "1963-05-01", forTopic: false}).then(({result, error}) => {
    console.log("From cloud, false")
    console.log(result)
    if(error) console.error(error.sqlMessage)
  })
  getCloud({dateMax: "1963-12-31", dateMin: "1963-05-01", forTopic: true}).then(({result, error}) => {
    console.log("From cloud, true")
    console.log(result)
    if(error) console.error(error.sqlMessage)
  })
  const ret = createDBCloud({dateMax, dateMin, forTopic})

  return json(ret)
}