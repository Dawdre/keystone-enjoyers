import { useFetch } from '@vueuse/core'
import type { Character } from '@/types/keystone'
import { computed } from 'vue'
import { capitaliseWords } from '@/utils/capitaliseWord'

const KEYSTONE_API_URL = 'https://ashypls-001-site1.ftempurl.com/KS_microservice.asmx/bestKeysAll'

export async function useCharacterKeystones() {
  const { data: characterKeystones, isFetching: isLoadingCharacterKeystones } =
    await useFetch<Array<Character>>(KEYSTONE_API_URL).json()

  characterKeystones.value = characterKeystones.value.map((char: Character) => ({
    ...char,
    characterName: capitaliseWords(char.characterName)
  }))

  const getKeystonePlayer = (property: keyof Character, name: string) =>
    computed(() => {
      const foundItem = characterKeystones.value.find(
        (item: Character) => item.characterName === name
      )

      return foundItem ? (foundItem[property] as Character) : null
    })

  return { characterKeystones, isLoadingCharacterKeystones, getKeystonePlayer }
}
