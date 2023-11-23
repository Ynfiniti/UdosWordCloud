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

export interface DBCloud{
    name: string
    amount: number
}

export interface DBTimeline{
    date: string
    amount: number
    href: string
}