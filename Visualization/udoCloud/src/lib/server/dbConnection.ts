import mysql from "mysql2/promise";
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

/**
 * TODO Format every return value into the wanted data structure after it is confirmed, that the wanted values are loaded from the database
 */

const mysqlconn: mysql.Connection = await mysql.createConnection({
    // host: "162.241.218.208",
    // user: "algyvwmy_state_reader",
    // password: "SveltekitMySQL",
    // database: "algyvwmy_states",
    host: "udos-word-cluster.cpmzi0faommf.eu-central-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "YjPSBs1HYPKDHD1Ox7dW",
    database: "udocloud"
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
            const topicID = topics[0].topicID;

            // Get timeline
            [timeline, columns] = await mysqlconn.query(queryTopicTimeline(topicID))
        } else {
            [timeline, columns] = await mysqlconn.query(queryTokenTimeline(searchInput.value))
        }
        retArr = {timeline, columns}
    } catch (error) {
        console.error("Got an error!!!");
        console.log(error)
        retError = error as (Error & { sqlMessage: string })
    } finally {
        // eslint-disable-next-line no-unsafe-finally
        return {result: retArr, error: retError}
    }
}

export async function getTest() {
    const testCon: mysql.Connection = await mysql.createConnection({
        host: "162.241.218.208",
        user: "algyvwmy_state_reader",
        password: "SveltekitMySQL",
        database: "algyvwmy_states",
    });
    try {
        const [results] = await testCon.query("SELECT state FROM states;")

        return {
            data: results,
        };
    } catch (error) {
        console.error("Got an error!!!");
        console.log(error);
        return error;
    }
}