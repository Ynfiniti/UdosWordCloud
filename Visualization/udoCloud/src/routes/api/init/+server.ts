import {json} from '@sveltejs/kit'
import {init} from "$lib/server/fileUtils.js"

// /api/newsletter GET

export async function GET() {
  console.log("init")

  const ret = await init()

  return json(ret)
}