import type {RequestEvent} from '@sveltejs/kit'
import {json} from '@sveltejs/kit'
import {getTimeline} from "$lib/server/dbConnection";
import type {DBTimelineDataElement, DBTimelineReturn, Href} from "$lib/database/dbTypes";

// /api/newsletter GET

export async function GET(event: RequestEvent) {
    const value: string = event.url.searchParams.get("value") || ""
    const forTopic: boolean = event.url.searchParams.get("forTopic") === "true"

    const {result, error} = await getTimeline({value, forTopic})

    if(error || !result){
        console.log("Error in timeline api", value, forTopic, "\n", error)
        return json([])
    }

    const retTimeline = parseTimeline(result.timeline[0] as Array<DBTimelineReturn> || [])

    return json(retTimeline)
}

function parseTimeline(timeline: Array<DBTimelineReturn>){
    /**
     * date: string
     * amount: number
     * hrefs: [{
     *     link: string
     *     amount: number
     * }]
     */
    const retArr: Array<DBTimelineDataElement> = []
    const dateGroup: { [key: string]: DBTimelineReturn[] } = {}
    for(const t of timeline){
        if(t.date in dateGroup) dateGroup[t.date].push(t)
        else dateGroup[t.date] = [t]
    }
    for(const date in dateGroup){
        const amount = dateGroup[date].map(d => parseInt(d.amount)).reduce((a, b) => a+b)
        const hrefs = dateGroup[date].map(e => {
            return {
                link: e.href,
                amount: parseInt(e.amount)
            } as Href
        })
        retArr.push({date, amount, hrefs})
    }

    return retArr
}