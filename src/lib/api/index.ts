import createClient, { Middleware } from 'openapi-fetch'
import type * as schema from './schema'
import env from '@/config/env'

export type PrefectureResult = schema.components['schemas']['PrefectureResponse']['result'][number]

export type PopulationResult = schema.components['schemas']['PopulationResponse']['result']

const throwOnError: Middleware = {
  async onResponse({ response }) {
    const body = response.headers.get('content-type')?.includes('json')
      ? await response.clone().json()
      : await response.clone().text()

    if (response.status >= 400) {
      throw new Error(body)
    } else if (body === '400') {
      throw new Error('Bad Request')
    } else if (body.statusCode === '403') {
      throw new Error('Forbidden')
    } else if (body === '404' || body.statusCode === '404') {
      throw new Error('Not Found')
    }
    return undefined
  },
}

const client = createClient<schema.paths>({
  baseUrl: env.RESAS_API_URL,
  headers: {
    'X-API-KEY': env.RESAS_API_KEY,
  },
})

client.use(throwOnError)

export default client
