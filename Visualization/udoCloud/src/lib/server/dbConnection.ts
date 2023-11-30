import mysql from "mysql2/promise";
import type {CloudSearchInputs} from "$lib/charts/cloud/cloudTypes";
import {
  queryArticlesInRange,
  queryDatesInRange,
  queryTokensFromArticles,
  queryTopicsFromArticles
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
  try {
    const [dates] = await mysqlconn.query(queryDatesInRange(searchInput.dateMin, searchInput.dateMax))
    const [articles] = await mysqlconn.query(queryArticlesInRange(...dates))
    const queryResult = searchInput.forTopic? queryTopicsFromArticles : queryTokensFromArticles
    const [tokens] = await mysqlconn.query(queryResult(...articles))
    return tokens;
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return error;
  }
}

export async function getTimeline(searchInputs?: Array<TimelineSearchInputs>){
  searchInputs = searchInputs || [{value: "kennedy", forTopic: false}]
  try{
    for(let searchInput of searchInputs){

    }
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return error;
  }
}