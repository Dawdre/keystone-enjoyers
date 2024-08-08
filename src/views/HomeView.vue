<script setup lang="ts">
import { UseImage } from '@vueuse/components'
import { NCard, NSkeleton } from 'naive-ui'
import { BlizzAPIHosts } from '@/types/api'
import { useCharacterProfile } from '@/composables/useCharacterProfile'
import { useCharacterKeystones } from '@/composables/useCharacterKeystones'

const { characterKeystones, getKeystonePlayer } = await useCharacterKeystones()
const { getCharacterProfile, getImageType, isLoadingProfile } = await useCharacterProfile(
  BlizzAPIHosts.EU,
  characterKeystones
)
</script>

<template>
  <main>
    <template v-if="isLoadingProfile">
      <n-skeleton v-for="n in characterKeystones.length" :key="n" :sharp="false" :height="150" />
    </template>
    <n-card
      v-else
      v-for="player in characterKeystones"
      :key="player.characterName"
      :title="player.characterName"
    >
      <use-image :src="getImageType('avatar', player.characterName).value">
        <template #loading>
          <n-skeleton :height="60" />
        </template>

        <template #error> Failed </template>
      </use-image>
    </n-card>
  </main>
</template>
