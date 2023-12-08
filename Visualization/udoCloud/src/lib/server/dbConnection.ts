import mysql from "mysql2/promise";
import type {CloudSearchInputs} from "$lib/charts/cloud/cloudTypes";
import {
    queryArticlesInRange,
    queryDatesInRange,
    queryTokensFromArticles,
    queryTokenTimeline,
    queryTopicID,
    queryTopicMatchesForHref,
    queryTopicsFromArticles,
    queryTopicTimeline
} from "$lib/server/dbUtils";
import type {TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";
import type {DBArticle, DBDate} from "$lib/database/dbTypes";

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
    console.log("Searching in db", searchInput)
    let retError: (Error & { sqlMessage: string }) | undefined
    try {
        const [dates]: [DBDate[]] = await mysqlconn.query(queryDatesInRange(searchInput.dateMin, searchInput.dateMax))
        const [articles]: [DBArticle[]] = await mysqlconn.query(queryArticlesInRange(...(dates.map(d => d.dateID))))
        const queryResult = searchInput.forTopic ? queryTopicsFromArticles : queryTokensFromArticles
        const [tokens, columns] = await mysqlconn.query(queryResult(...(articles.map(a => a.articleID))))
        retToken = {tokens, columns};
    } catch (error) {
        console.error("Got an error!!!");
        retError = error as (Error & { sqlMessage: string });
    } finally {
        // eslint-disable-next-line no-unsafe-finally
        return {result: retToken, error: retError}
    }
}

export async function getTimeline(searchInputs?: Array<TimelineSearchInputs>) {
    searchInputs = searchInputs || [{value: "kennedy", forTopic: false}]
    const retArr: Array<{ timeline: unknown, columns: unknown }> = []
    let retError: (Error & { sqlMessage: string }) | undefined
    try {
        for (const searchInput of searchInputs) {
            let timeline, columns
            if (searchInput.forTopic) {
                // Get topic ID
                const [topicIDs] = await mysqlconn.query(queryTopicID(searchInput.value));
                const topicID = topicIDs?.[0]?.data[0] || "";

                // Get timeline
                [timeline, columns] = await mysqlconn.query(queryTopicTimeline(topicID))

                // Get all articles found and then the hrefs with amounts of topic matches
                const articleIDs: Array<string> = timeline?.data?.[0]?.["articles"] || []
                const [hrefs] = await mysqlconn.query(queryTopicMatchesForHref(topicID, ...articleIDs))
                // Attach hrefs and amounts to data in form ["href##amount", ...]
                if (timeline.data?.length == 0)
                    timeline.data[0]["hrefs"] = hrefs
            } else {
                [timeline, columns] = await mysqlconn.query(queryTokenTimeline(searchInput.value))
            }
            retArr.push({timeline, columns})
        }
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