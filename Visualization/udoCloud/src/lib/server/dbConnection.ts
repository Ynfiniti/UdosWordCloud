import mysql from "mysql2/promise";
import * as dbSecrets from "../../../static/secrets.json"
import type {CloudSearchInputs} from "$lib/charts/cloud/cloudTypes";
import {
    queryArticlesInRange,
    queryDatesInRange,
    queryTokensFromArticles,
    queryTokenTimeline,
    queryTopicID,
    queryTopicsFromArticles,
    queryTopicTimeline
} from "$lib/server/dbUtils";
import type {TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";
import type {DBArticle, DBDate, DBTopic, DBTimelineReturn} from "$lib/database/dbTypes";

const mysqlconn: mysql.Connection = await mysql.createConnection({
    host: dbSecrets.host,
    port: dbSecrets.port,
    user: dbSecrets.user,
    password: dbSecrets.password,
    database: dbSecrets.database
});

export async function getCloud(searchInput?: CloudSearchInputs) {
    searchInput = searchInput || {dateMax: "1963-12-31", dateMin: "1963-05-01", forTopic: false}
    let retToken = {tokens: undefined, columns: undefined}
    let retError: (Error & { sqlMessage: string }) | undefined

    try {
        const [dates]: [DBDate[]] = await mysqlconn.query(queryDatesInRange(searchInput.dateMin, searchInput.dateMax))
        const dateIDs = dates.map(d => d.dateID)
        const [articles]: [DBArticle[]] = await mysqlconn.query(queryArticlesInRange(...dateIDs))
        const articleIDs = articles.map(a => a.articleID)
        const queryResult = searchInput.forTopic ? queryTopicsFromArticles : queryTokensFromArticles
        const [tokens, columns] = await mysqlconn.query(queryResult(...articleIDs))
        retToken = {tokens, columns};
    } catch (error) {
        retError = error as (Error & { sqlMessage: string });
    } finally {
        // eslint-disable-next-line no-unsafe-finally
        return {result: retToken, error: retError}
    }
}

export async function getTimeline(searchInput: TimelineSearchInputs) {
    searchInput = searchInput || {value: "kennedy", forTopic: false}
    let retArr: {timeline: unknown, columns: unknown } | undefined
    let retError: (Error & { sqlMessage: string }) | undefined
    try {
        let timeline: DBTimelineReturn[], columns
        if (searchInput.forTopic) {
            // Get topic ID
            const [topics]: [DBTopic[]] = await mysqlconn.query(queryTopicID(searchInput.value));
            const topicID = topics[0]?.topicID || -1;

            // Get timeline
            [timeline, columns] = await mysqlconn.query(queryTopicTimeline(topicID))
        } else {
            [timeline, columns] = await mysqlconn.query(queryTokenTimeline(searchInput.value))
        }
        retArr = {timeline, columns}
    } catch (error) {
        retError = error as (Error & { sqlMessage: string })
    } finally {
        // eslint-disable-next-line no-unsafe-finally
        return {result: retArr, error: retError}
    }
}