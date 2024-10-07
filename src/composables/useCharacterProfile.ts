import slug from 'slug'
import type { BlizzAPIHosts, CreateNamespace } from '@/types/api'
import { BlizzAPINamespaces } from '@/types/api'
import { useFetch } from '@vueuse/core'
import { useOauthToken } from './useOauthToken'
import { computed, ref, type Ref } from 'vue'
import type { Character } from '@/types/keystone'

interface CharacterProfile {
  profileData: any
  profileDataMedia: any
}

export async function useCharacterProfile(
  regionHost: BlizzAPIHosts,
  characterKeystones: Ref<Array<Character>>
) {
  const allProfiles = ref<Array<CharacterProfile>>()
  const isLoadingProfile = ref(false)

  const getNamespace: CreateNamespace = (namespace, region) =>
    `${namespace}-${region.toLowerCase()}`

  const { token } = await useOauthToken()
  const queryParams = new URLSearchParams({
    locale: 'en_GB',
    namespace: getNamespace(BlizzAPINamespaces.PROFILE, 'EU')
  })
  const headers = {
    Authorization: `Bearer ${token.value.access_token}`
  }

  const promises = characterKeystones.value.map(async (player: Character) => {
    const encodedCharacter = encodeURIComponent(player.characterName.toLowerCase())
    const uri = `${regionHost}/profile/wow/character/${slug(player.characterRealm)}/${encodedCharacter}?${queryParams}`

    isLoadingProfile.value = true

    const { data: profileDataResponse, error } = await useFetch(uri, { headers }).json()

    if (!error.value) {
      const { data: profileDataMediaResponse } = await useFetch(
        profileDataResponse.value.media.href,
        { headers }
      ).json()

      return {
        profileData: profileDataResponse.value,
        profileDataMedia: profileDataMediaResponse.value
      } as CharacterProfile
    }
  })
  const results = await Promise.all(promises)

  isLoadingProfile.value = false
  allProfiles.value = results.filter(Boolean) as Array<CharacterProfile>

  const getCharacterProfile = (name: string) =>
    computed(() => {
      const foundItem = allProfiles.value!.find(
        (profile: CharacterProfile) => profile.profileData.name.toLowerCase() === name.toLowerCase()
      )

      return foundItem ? foundItem : null
    })

  const getImageType = (type: 'avatar' | 'inset' | 'main-raw', name: string) =>
    computed<string>(() => {
      const foundItem = getCharacterProfile(name).value?.profileDataMedia.assets.find(
        (data: Record<string, any>) => data.key === type
      )

      return foundItem ? foundItem.value : null
    })

  return {
    allProfiles,
    isLoadingProfile,
    getCharacterProfile,
    getImageType
  }
}
