import type {DBCloud, DBTimeline} from "./dbTypes";
import type {TimelineSearchInputs} from "$lib/SearchInput/timeline/timelineSearchInputTypes";
import type {CloudSearchInputs} from "$lib/SearchInput/cloud/cloudSearchInputTypes";

let data: Array<fileData> = []

interface WordCount{
    [key: string]: {
        amount: number
    }
}

export class fileData{
    date!: string
    href!: string
    topics!: Array<string>
    wordCount!: WordCount
}

async function fetchAll(){
    const rets: Array<Array<fileData>> = []
    for(let i = 1; i < 13; i++){
        const res = await fetch(`/resultfiles/result_1963_${i}.json`)
        rets.push(await res.json() as Array<fileData>)
    }
    return rets.flat().map(d => {
        d.date = d.date.split("T")[0]
        return Object.assign(new fileData(), d)
    })
}

export async function init() {
    data = await fetchAll()
}

export function getData(){
    return data
}

export function createDBCloud(searchInputs: CloudSearchInputs){
    const filtered = data.filter(d =>
      d.date >= searchInputs.dateMin
      && d.date <= searchInputs.dateMax
    )
    return searchInputs.forTopic? getTopicAmount(filtered) : getTokenAmount(filtered)
}

export function createDBTimeline(searchInput: TimelineSearchInputs){
    const filtered = data.filter(d =>
      searchInput.forTopic? d.topics.includes(searchInput.value) : searchInput.value in d.wordCount
    )
    return getTimeline(filtered)
}

function getTokenAmount(articles: Array<fileData>){
    // Sum up all amounts for each token
    const amounts: {[key: string]: number} = {}
    articles.forEach(a => {
        for(const token in a.wordCount){
            if(token in amounts)
                amounts[token] += a.wordCount[token].amount
            else
                amounts[token] = a.wordCount[token].amount
        }
    })

    // Parse to DBCloud array
    const retArr: Array<DBCloud> = []
    for(const token in amounts){
        retArr.push({name: token, amount: amounts[token]})
    }

    return retArr.filter(e => isNaN(parseInt(e.name)))
}

function getTopicAmount(articles: Array<fileData>){
    // Count each topic
    const amounts: {[key: string]: number} = {}
    articles.forEach(a => {
        for(const token of a.topics){
            if(token in amounts)
                amounts[token]++
            else
                amounts[token] = 1
        }
    })

    // Parse to DBCloud array
    const retArr: Array<DBCloud> = []
    for(const token in amounts){
        retArr.push({name: token, amount: amounts[token]})
    }

    return retArr
}

function getTimeline(articles: Array<fileData>){
    // Count the dates and gather all hrefs from a date
    const retAmounts: DBTimeline = {}
    articles.forEach(a => {
        if(a.date in retAmounts){
            retAmounts[a.date].amount++
            retAmounts[a.date].hrefs.push(a.href)
        }
        else{
            retAmounts[a.date] = {
                amount: 1,
                hrefs: [a.href]
            }
        }

    })

    return retAmounts
}