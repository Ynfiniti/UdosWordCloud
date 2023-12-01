import mysql from "mysql2/promise";
import type {CloudSearchInputs} from "$lib/charts/cloud/cloudTypes";
import {
  queryArticlesInRange,
  queryDatesInRange,
  queryTokensFromArticles, queryTokenTimeline,
  queryTopicsFromArticles, queryTopicTimeline
} from "$lib/server/dbUtils";
import type {TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";

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
  let retError: (Error&{sqlMessage: string}) | undefined
  try {
    const [dates] = await mysqlconn.query(queryDatesInRange(searchInput.dateMin, searchInput.dateMax))
    const [articles] = await mysqlconn.query(queryArticlesInRange(...dates))
    const queryResult = searchInput.forTopic? queryTopicsFromArticles : queryTokensFromArticles
    const [tokens, columns] = await mysqlconn.query(queryResult(...articles))
    retToken = {tokens, columns};
  } catch (error) {
    console.error("Got an error!!!");
    retError = error as (Error&{sqlMessage: string});
  }
  finally{
    // eslint-disable-next-line no-unsafe-finally
    return {result: retToken, error: retError}
  }
}

export async function getTimeline(searchInputs?: Array<TimelineSearchInputs>){
  searchInputs = searchInputs || [{value: "kennedy", forTopic: false}]
  const retArr: Array<{timeline: unknown, columns: unknown}> = []
  let retError: (Error&{sqlMessage: string}) | undefined
  try{
    for(const searchInput of searchInputs){
      const queryResult = searchInput.forTopic? queryTopicTimeline : queryTokenTimeline
      const [timeline, columns] = await mysqlconn.query(queryResult(searchInput.value))
      retArr.push({timeline, columns})
    }
  } catch (error) {
    console.error("Got an error!!!");
    retError = error as (Error&{sqlMessage: string})
  }
  finally{
    // eslint-disable-next-line no-unsafe-finally
    return {result: retArr, error: retError}
  }
}