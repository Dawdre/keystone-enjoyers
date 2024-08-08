export enum BlizzAPIHosts {
  EU = 'https://eu.api.blizzard.com',
  US = 'https://us.api.blizzard.com',
  KR = 'https://kr.api.blizzard.com',
  TW = 'https://tw.api.blizzard.com',
  CN = 'https://cn.api.blizzard.com'
}

export enum BlizzAPINamespaces {
  STATIC = 'static',
  PROFILE = 'profile'
}

export type HostKey = keyof typeof BlizzAPIHosts
export type CreateNamespace = (namespace: BlizzAPINamespaces, region: HostKey) => string
