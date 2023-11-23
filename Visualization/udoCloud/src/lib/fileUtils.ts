import type {DBCloud} from "./dbTypes";

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

export function createDBCloud(dateMin: string, dateMax: string, forTopic = false){
    const filtered = data.filter(d => d.date >= dateMin && d.date <= dateMax)
    return forTopic? getTopicAmount(filtered) : getTokenAmount(filtered)
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

    return retArr
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