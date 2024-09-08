import createClient, { Middleware } from 'openapi-fetch'
import type * as schema from './schema'
import env from '@/config/env'

export type PrefectureResult = schema.components['schemas']['PrefectureResponse']['result'][number]

export type PopulationResult = schema.components['schemas']['PopulationResponse']['result']

const throwOnError: Middleware = {
  async onResponse({ response }) {
    if (response.status >= 400) {
      const body = response.headers.get('content-type')?.includes('json')
        ? await response.clone().json()
        : await response.clone().text()
      throw new Error(body)
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
