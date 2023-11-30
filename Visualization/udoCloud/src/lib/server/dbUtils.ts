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
  return `SELECT token.name, sum(token.amount)
          FROM token
          WHERE token.articleID IN (${articleIDs.join(", ") || "NULL"})
          GROUP BY token.name;`
}

export function queryTopicsFromArticles(...articleIDs: string[]){
  return `SELECT t.name, count(t.name)
          FROM topic t
          JOIN article_to_topic att USING(topicID)
          WHERE att.articleID IN (${articleIDs.join(", ") || "NULL"})
          GROUP BY t.name;`
}