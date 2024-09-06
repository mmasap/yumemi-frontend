import createClient from 'openapi-fetch'
import type * as schema from './schema'
import env from '@/config/env'

export type PrefectureResult =
  schema.components['schemas']['PrefectureResponse']['result'][number]

export type PopulationResult =
  schema.components['schemas']['PopulationResponse']['result']

const client = createClient<schema.paths>({
  baseUrl: env.RESAS_API_URL,
  headers: {
    'X-API-KEY': env.RESAS_API_KEY,
  },
})
export default client
