import type {RequestEvent} from '@sveltejs/kit'
import {json} from '@sveltejs/kit'
import {getCloud} from "$lib/server/dbConnection";

export async function GET(event: RequestEvent) {
    const dateMax: string = event.url.searchParams.get("dateMax") || ""
    const dateMin: string = event.url.searchParams.get("dateMin") || ""
    const forTopic: boolean = event.url.searchParams.get("forTopic") === "true"

    const {result, error} = await getCloud({dateMax, dateMin, forTopic})

    if(error || !result){
        console.log("Error in cloud api: ", dateMin, dateMax, forTopic, "\n", error)
        return json([])
    }

    const wordcloud = result.wordcloud[0].map(ele => {
        ele.name = decodeURIComponent(ele.name)
        ele.amount = parseInt(ele.amount)
        return ele
    })

    return json(wordcloud)
}