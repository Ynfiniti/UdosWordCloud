import mysql from "mysql2/promise";
import * as dbSecrets from "../../../static/db.json"
import type {CloudSearchInputs} from "$lib/charts/cloud/cloudTypes";
import type {TimelineSearchInputs} from "$lib/charts/timeline/timelineTypes";
import {sqlTokenTimeline, sqlTokenWordcloud, sqlTopicTimeline, sqlTopicWordcloud} from "$lib/server/dbUtils";

const mysqlPool: mysql.Pool = mysql.createPool({
    host: dbSecrets.HOST,
    port: parseInt(dbSecrets.PORT),
    user: dbSecrets.USER,
    password: dbSecrets.PASSWORD,
    database: dbSecrets.DATABASE,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

export async function getCloud(searchInput?: CloudSearchInputs) {


    searchInput = searchInput || {dateMax: "1963-12-31", dateMin: "1963-05-01", forTopic: false}
    let retToken: {wordcloud: mysql.RowDataPacket[][], columns: mysql.FieldPacket[]} | undefined
    let retError: (Error & { sqlMessage: string }) | undefined

    try {
        const sqlQuery = searchInput.forTopic? sqlTopicWordcloud : sqlTokenWordcloud
        const searchValues = [searchInput.dateMin, searchInput.dateMax]
        const [wordcloud, columns] = await mysqlPool.execute<mysql.RowDataPacket[][]>(sqlQuery, searchValues)
        retToken = {wordcloud, columns};
    } catch (error) {
        retError = error as (Error & { sqlMessage: string });
    }

    // eslint-disable-next-line no-unsafe-finally
    return {result: retToken, error: retError}
}

export async function getTimeline(searchInput: TimelineSearchInputs) {
    searchInput = searchInput || {value: "kennedy", forTopic: false}
    let retArr: {timeline: mysql.RowDataPacket[][], columns: mysql.FieldPacket[] } | undefined
    let retError: (Error & { sqlMessage: string }) | undefined
    try {
        const sqlQuery = searchInput.forTopic? sqlTopicTimeline : sqlTokenTimeline
        const searchValue = encodeURI(searchInput.value)
        const [timeline, columns] = await mysqlPool.execute<mysql.RowDataPacket[][]>(sqlQuery, [searchValue])
        retArr = {timeline, columns}
    } catch (error) {
        retError = error as (Error & { sqlMessage: string })
    }
    // eslint-disable-next-line no-unsafe-finally
    return {result: retArr, error: retError}
}