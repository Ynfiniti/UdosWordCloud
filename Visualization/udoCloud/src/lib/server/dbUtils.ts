export const hrefTokenSeperator = "##"

export function queryDatesInRange(dateMin: string, dateMax: string) {
    return `SELECT dateID 
          FROM date 
          WHERE publish_date >= '${dateMin}'
          AND publish_date <= '${dateMax}'
          `
}

export function queryArticlesInRange(...datesIDs: number[]) {
    return `SELECT articleID
          FROM article
          WHERE dateID IN (${datesIDs.join(", ") || "NULL"})`
}

export function queryTokensFromArticles(...articleIDs: number[]) {
    return `SELECT t.name as name, sum(t.amount) as amount
          FROM token t
          WHERE t.articleID IN ('${articleIDs.join("', '") || "NULL"}')
          AND t.name REGEXP '[a-zA-z].*'
          GROUP BY t.name
          ORDER BY amount DESC
          LIMIT 100;`
}

export function queryTopicsFromArticles(...articleIDs: number[]) {
    return `SELECT t.name as name, count(t.name) as amount
          FROM topic t
          JOIN article_to_topic att USING(topicID)
          WHERE att.articleID IN ('${articleIDs.join("', '") || "NULL"}')
          AND t.name REGEXP '[a-zA-z].*'
          GROUP BY t.name
          ORDER BY amount DESC
          LIMIT 100;`
}

export function queryTokenTimeline(token: string) {
    return `SELECT t.name as name, SUM(t.amount) as amount, d.publish_date, 
          GROUP_CONCAT(CONCAT(a.href, '${hrefTokenSeperator}', t.amount) SEPARATOR ', ') as hrefs
          FROM token t
          JOIN article a USING(articleID)
          JOIN date d USING(dateID)
          WHERE t.name LIKE '${token}'
          GROUP BY d.publish_date`
}

export function queryTopicID(name: string) {
    return `SELECT topicID
          FROM topic
          WHERE name LIKE '${name}'`
}

export function queryTopicTimeline(topicID: string) {
    return `SELECT t.name as name, COUNT(t.name) as amount, GROUP_CONCAT(a.articleID SEPARATOR ', ') as articles
          FROM article_to_topic att
          JOIN topic t USING(topicID)
          JOIN article a USING(articleID)
          JOIN date d USING(dateID)
          WHERE att.topicID = ${topicID || -1}
          GROUP BY d.publish_date`
}

export function queryTopicMatchesForHref(topicID: string, ...articleIDs: string[]) {
    console.log("got something", topicID || -1, articleIDs?.join("', '") || "NULL")
    return `SELECT a.href as link, COUNT(att.articleID) as amount
          FROM article_to_topic att
          JOIN article a USING(articleID)
          WHERE att.topicID = ${topicID || -1}
          AND articleID IN ('${articleIDs?.join("', '") || "NULL"}')
          GROUP BY a.href`
}