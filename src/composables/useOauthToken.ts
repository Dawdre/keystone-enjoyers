import { useFetch } from '@vueuse/core'
import type { Ref } from 'vue'

interface OauthToken {
  access_token: string
  token_type: string
  expires_in: number
  sub: string
}

const AUTH_TOKEN_URL = 'https://oauth.battle.net/token'

export async function useOauthToken(): Promise<{ token: Ref<OauthToken> }> {
  const credentials = `${import.meta.env.VITE_BATTLENET_CLIENT_ID}:${import.meta.env.VITE_BATTLENET_CLIENT_SECRET}`
  const basicAuthHeader = `Basic ${btoa(credentials)}`

  const body = new FormData()
  body.append('grant_type', 'client_credentials')

  const { data: token } = await useFetch(AUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader
    },
    body: body
  }).json()

  return { token }
}
