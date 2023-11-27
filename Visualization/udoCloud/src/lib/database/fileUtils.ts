import type {DBCloudElement, DBTimelineElement} from "./dbTypes";
import type {TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";
import type {CloudSearchInputs} from "$lib/charts/cloud/cloudSearchInputTypes";

let data: Array<FileData> = []

interface WordCount {
  [key: string]: {
    amount: number
  }
}

export class FileData {
  date!: string
  href!: string
  topics!: Array<string>
  wordCount!: WordCount
}

async function fetchAll() {
  const rets: Array<Array<FileData>> = []
  for (let i = 1; i < 13; i++) {
    const res = await fetch(`/resultfiles/result_1963_${i}.json`)
    rets.push(await res.json() as Array<FileData>)
  }
  return rets.flat().map(d => {
    d.date = d.date.split("T")[0]
    return Object.assign(new FileData(), d)
  })
}

export async function init() {
  let ret = true
  try {
    data = await fetchAll()
  } catch (e) {
    console.log((e as Error).message)
    ret = false
  }
  return ret
}

export function getData() {
  return data
}

export function createDBCloud(searchInputs: CloudSearchInputs) {
  const filtered = data.filter(d =>
    d.date >= searchInputs.dateMin
    && d.date <= searchInputs.dateMax
  )

  return searchInputs.forTopic ? getTopicAmount(filtered) : getTokenAmount(filtered)
}

export function createDBTimeline(searchInput: TimelineSearchInputs) {
  searchInput.value = searchInput.value.toLowerCase()
  const filtered = data.filter(d =>
    searchInput.forTopic ?
      d.topics.includes(searchInput.value)
      : searchInput.value in d.wordCount
  )
  return getTimeline(searchInput.value, filtered, searchInput.forTopic)
}

function getTokenAmount(articles: Array<FileData>) {
  // Sum up all amounts for each token
  const amounts: { [key: string]: number } = {}
  articles.forEach(a => {
    for (const token in a.wordCount) {
      if (token in amounts)
        amounts[token] += a.wordCount[token].amount
      else
        amounts[token] = a.wordCount[token].amount
    }
  })

  // Parse to DBCloud array
  const retArr: Array<DBCloudElement> = []
  for (const token in amounts) {
    retArr.push({word: token, value: amounts[token]})
  }

  return retArr.filter(e => isNaN(parseInt(e.word)) && e.word.trim() !== "")
}

function getTopicAmount(articles: Array<FileData>) {
  // Count each topic
  const amounts: { [key: string]: number } = {}
  articles.forEach(a => {
    for (const token of a.topics) {
      if (token in amounts)
        amounts[token]++
      else
        amounts[token] = 1
    }
  })

  // Parse to DBCloud array
  const retArr: Array<DBCloudElement> = []
  for (const token in amounts) {
    retArr.push({word: token, value: amounts[token]})
  }

  return retArr
}

function getTimeline(searchString: string, articles: Array<FileData>, forTopic: boolean) {
  // Count the dates and gather all hrefs from a date
  const amounts: { [key: string]: { amount: number, hrefs: Array<{ link: string, amount: number }> } } = {}
  articles.forEach(a => {
    const occurrences = forTopic ? getOccurrence(a.topics, searchString) : a.wordCount[searchString].amount
    if (a.date in amounts) {
      amounts[a.date].amount += occurrences
      amounts[a.date].hrefs.push({link: a.href, amount: occurrences})
    } else {
      amounts[a.date] = {
        amount: occurrences,
        hrefs: [{link: a.href, amount: occurrences}]
      }
    }
  })

  const retArray: Array<DBTimelineElement> = []
  for (const date in amounts) {
    retArray.push({date, amount: amounts[date].amount, hrefs: amounts[date].hrefs})
  }

  return retArray
}

function getOccurrence(array: Array<string>, value: string) {
  let count = 0;
  array.forEach((v) => (v === value && count++));
  return count;
}