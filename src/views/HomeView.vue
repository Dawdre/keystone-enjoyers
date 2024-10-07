<script setup lang="ts">
import {
  NCard,
  NSkeleton,
  NNumberAnimation,
  type NumberAnimationInst,
  NStatistic,
  NSelect,
  NInputNumber,
  NH2,
  NButton
} from 'naive-ui'
import { BlizzAPIHosts } from '@/types/api'
import { useCharacterProfile } from '@/composables/useCharacterProfile'
import { useCharacterKeystones } from '@/composables/useCharacterKeystones'
import { computed, ref } from 'vue'
import type { Character, CurrentDungeon, Dungeon } from '@/types/keystone'
import { ClassColours, type WoWClass } from '@/types/util'
import { useFetch } from '@vueuse/core'

const iLevel = ref<NumberAnimationInst | null>(null)
const rating = ref<NumberAnimationInst | null>(null)

// canvas refs - may not use
const original = ref<HTMLCanvasElement | null>(null)
const drawn = ref<HTMLCanvasElement | null>(null)

const DUNGEON_ROTATION_URL =
  'https://ashypls-001-site1.ftempurl.com/KS_microservice.asmx/dungeonRotation'

const selectedDungeon = ref(null)
const selectedKeyLevel = ref(2)
const { data: currentDungeons } = await useFetch<Array<CurrentDungeon>>(DUNGEON_ROTATION_URL).json()
const dungeonOptions = computed(() => {
  return currentDungeons.value.map((dungeon: CurrentDungeon) => {
    return {
      label: `${dungeon.dungeon_name} - ${dungeon.dungeon_short_name}`,
      value: dungeon.dungeon_id
    }
  })
})

// TODO: split out chacters and keystones into their own component
const { characterKeystones } = await useCharacterKeystones()
const { getCharacterProfile, getImageType } = await useCharacterProfile(
  BlizzAPIHosts.EU,
  characterKeystones
)

const filteredCharacterKeystones = computed<Array<Character>>(() =>
  characterKeystones.value.filter((char: Character) => char.characterClass)
)

const getAllCharacterImages = computed(() => {
  return filteredCharacterKeystones.value.map((char: Character) =>
    getImageType('main-raw', char.characterName)
  )
})

const getGridTemplateRows = computed(() => {
  const len = (filteredCharacterKeystones.value.length / 2).toFixed()
  return `repeat(${len}, 180px)`
})

const buildCharacterCardStyles = (name: string, charClass: WoWClass) =>
  computed(() => {
    return {
      border: `solid ${ClassColours[charClass]}`,
      backgroundImage: `url(${getImageType('main-raw', name).value})`
    }
  })

function whoNeedsIt() {
  characterKeystones.value = characterKeystones.value.filter((char: Character) => {
    return char.dungeons.some((dungeon: Dungeon) => {
      if (Number(dungeon.dungeonID) !== selectedDungeon.value) return false

      const level = dungeon.bestRun?.level ?? 0
      const inTime = dungeon.bestRun?.inTime ?? false

      return level < selectedKeyLevel.value || (level === selectedKeyLevel.value && !inTime)
    })
  })
}

/**
 * Cuts out a portion of an image based on its transparent pixels. MAY NOT USE
 *
 * @param {string} url - The URL of the image to cut out.
 * @return {void}
 */
function cutout(url: string) {
  const ctx = original.value!.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.src = url
  img.onload = () => {
    original.value!.width = img.width
    original.value!.height = img.height
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, img.width, img.height)
    const data = imageData.data

    let minX = img.width,
      minY = img.height,
      maxX = 0,
      maxY = 0

    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const index = (y * img.width + x) * 4
        const alpha = data[index + 3]

        if (alpha > 0) {
          if (x < minX) minX = x
          if (y < minY) minY = y
          if (x > maxX) maxX = x
          if (y > maxY) maxY = y
        }
      }
    }

    const width = maxX - minX + 1
    const height = maxY - minY + 1

    drawn.value!.width = width
    drawn.value!.height = height
    ctx.drawImage(original.value!, minX, minY, width, height, 0, 0, width, height)
  }
}
</script>

<template>
  <main>
    <div class="ke-characters__form">
      <n-h2>What Keystone do you have?</n-h2>
      <n-select v-model:value="selectedDungeon" :options="dungeonOptions" />
      <n-input-number v-model:value="selectedKeyLevel" :min="2" :max="15" />
      <n-button type="primary" :disabled="!selectedDungeon" @click="whoNeedsIt"
        >Who needs it QUESTION MARK</n-button
      >
    </div>
    <div class="ke-characters" :style="`grid-template-rows: ${getGridTemplateRows};`">
      <!-- <n-skeleton v-for="n in 8" :key="n" :sharp="false" :height="450" /> -->
      <n-card
        v-for="player in characterKeystones"
        :key="player.characterName"
        :title="player.characterName"
        :style="buildCharacterCardStyles(player.characterName, player.characterClass!).value"
        header-class="ke-character-card__header"
        class="ke-character-card"
      >
        <div class="ke-character-card__stats">
          <n-statistic label="Item Level">
            <span class="ke-character-card__stats-value">
              <n-number-animation ref="iLevel" :from="0" :to="player.characterILevel" />
            </span>
          </n-statistic>
          <n-statistic label="Rating">
            <span
              class="ke-character-card__stats-value"
              :style="`color: ${player.characterRatingColor}`"
            >
              <n-number-animation ref="rating" :from="0" :to="player.characterRating" />
            </span>
          </n-statistic>
        </div>
        <div
          class="ke-character-card__bg"
          :style="`background-image: url(/images/${player.characterClass?.split(' ').join('')}.png)`"
        ></div>
      </n-card>
    </div>
  </main>
</template>

<style lang="scss">
.ke-characters {
  display: grid;
  grid-template-columns: repeat(auto-fill, 450px);
  gap: 1rem;
}

.ke-character-card {
  // border: solid rgb(133, 72, 72);
  background-repeat: no-repeat;
  background-position: 80px 45%;
  background-size: auto 400px;
  filter: drop-shadow(2px 4px 6px black) grayscale(0.25);

  &__header {
    & > .n-card-header__main {
      font-size: 1.7rem;
    }
  }

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: saturate(0.5) drop-shadow(2px 4px 6px black);
    opacity: 0.1;
    background-repeat: no-repeat;
    background-size: auto 300px;
    background-position: 0px 25%;
  }

  &__stats {
    display: flex;
    gap: 1rem;
    position: relative;
    z-index: 99;

    &-value {
      text-shadow: 3px 3px 2px black;
    }
  }
}
</style>
