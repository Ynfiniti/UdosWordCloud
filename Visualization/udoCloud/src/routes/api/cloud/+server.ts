import type {RequestEvent} from '@sveltejs/kit'
import {json} from '@sveltejs/kit'
import {getCloud} from "$lib/server/dbConnection";

export async function GET(event: RequestEvent) {
    const dateMax: string = event.url.searchParams.get("dateMax") || ""
    const dateMin: string = event.url.searchParams.get("dateMin") || ""
    const forTopic: boolean = event.url.searchParams.get("forTopic") === "true"

    const {result, error} = await getCloud({dateMax, dateMin, forTopic})

    if(error){
        console.log("Error in cloud api: ", error)
        return json([])
    }

    return json(result["tokens"])
}