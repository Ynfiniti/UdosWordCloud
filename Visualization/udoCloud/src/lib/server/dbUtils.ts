export function queryDatesInRange(dateMin: string, dateMax: string){
  return `SELECT dateID 
          FROM date 
          WHERE publish_date >= ${dateMin}
          AND publish_date <= ${dateMax}
          `
}

export function queryArticlesInRange(...datesIDs: string[]){
  return `SELECT articleID
          FROM article
          WHERE dateID IN (${datesIDs.join(", ") || "NULL"})`
}

export function queryTokensFromArticles(...articleIDs: string[]){
  return `SELECT token.name as name, sum(token.amount) as amount
          FROM token
          WHERE token.articleID IN (${articleIDs.join(", ") || "NULL"})
          GROUP BY token.name;`
}

export function queryTopicsFromArticles(...articleIDs: string[]){
  return `SELECT t.name as name, count(t.name) as amount
          FROM topic t
          JOIN article_to_topic att USING(topicID)
          WHERE att.articleID IN (${articleIDs.join(", ") || "NULL"})
          GROUP BY t.name;`
}

export function queryTokenTimeline(token: string){
  return `SELECT t.name as name, SUM(t.amount) as amount, d.publish_date, GROUP_CONCAT(a.href SEPARATOR ', ') as hrefs, 
          GROUP_CONCAT(t.amount SEPARATOR ', ') as amounts
          FROM token t
          JOIN article a USING(articleID)
          JOIN date d USING(dateID)
          WHERE t.name LIKE '${token}'
          GROUP BY d.publish_date`
}

export function queryTopicTimeline(topic: string){
  return `SELECT t.name as name, COUNT(t.name) as amount, GROUP_CONCAT(a.href SEPARATOR ', ') as hrefs,
          GROUP_CONCAT(COUNT(articleID) SEPARATOR ', ') as amounts
          FROM article_to_topic att
          JOIN topic t USING(topicID)
          JOIN article a USING(articleID)
          JOIN date d USING(dateID)
          WHERE t.name LIKE '${topic}'
          GROUP BY d.publish_date`
}