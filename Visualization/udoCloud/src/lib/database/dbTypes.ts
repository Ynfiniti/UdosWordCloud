export interface DBCloudElement {
    name: string
    amount: string
}

/**
 * Gathering the amount a token / topic occurred on a day and collect all hrefs as proof
 * label and forTopic are used to distinguish between multiple results for each searchInput provided
 */
export interface DBTimelineElement {
    data: Array<DBTimelineDataElement>,
    label: string,
    forTopic: boolean
}

export interface DBTimelineDataElement {
    date: string | Date
    amount: number
    hrefs: Array<Href>
}

export interface DBTimelineReturn {
    href: string
    amount: string,
    date: string
}

export interface Href {
    link: string,
    amount: number
}

export interface DBDate {
    dateID: number
    publish_date: string
}

export interface DBArticle {
    articleID: number
    href: string
    dateID: number
}

export interface DBToken {
    name: string
    amount: string
    articleID: number
}

export interface DBTopic {
    topicID: number
    name: string
}

export interface DBArticleToTopic {
    articleID: number
    topicID: number
}