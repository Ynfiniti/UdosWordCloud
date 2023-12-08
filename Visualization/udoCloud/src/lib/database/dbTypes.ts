/**
 * USE udocloud;
 * SELECT token.name, sum(token.amount)
 * FROM token
 * JOIN article a USING(articleID)
 * WHERE token.articleID IN
 * (    SELECT articleID
 *     FROM article JOIN topic USING(topicID)
 *     WHERE dateID IN
 *     (    SELECT dateID
 *         FROM date
 *         WHERE day LIKE 1
 *         AND month LIKE 1
 *         AND year LIKE 1970
 *     )
 *     AND topic.name IN ('Sport')
 * )
 * GROUP BY token.name;
 */

export interface DBCloudElement {
    name: string
    amount: string
}

/**
 * Object with all dates as keys.
 * Gathering the amount a token / topic occurred on a day and collect all hrefs as proof
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
    amount: number
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