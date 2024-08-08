import { useFetch } from '@vueuse/core'
import type { Character } from '@/types/keystone'
import { computed } from 'vue'

const KEYSTONE_API_URL = 'https://ashypls-001-site1.ftempurl.com/KS_microservice.asmx/bestKeysAll'

export async function useCharacterKeystones() {
  const { data: characterKeystones } = await useFetch<Array<Character>>(KEYSTONE_API_URL).json()

  const getKeystonePlayer = (property: keyof Character, name: string) =>
    computed(() => {
      const foundItem = characterKeystones.value.find(
        (item: Character) => item.characterName === name
      )
      console.log(foundItem[property])

      return foundItem ? (foundItem[property] as Character) : null
    })

  return { characterKeystones, getKeystonePlayer }
}
