import {json} from '@sveltejs/kit'
import {getData} from "$lib/server/fileUtils.js"

// /api/newsletter GET

export async function GET() {
  const ret = getData()

  return json(ret)
}