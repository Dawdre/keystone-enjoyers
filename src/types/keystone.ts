import type { WoWClass } from './util'

export interface Dungeon {
  bestRun: DungeonInfo | null
  dungeonBossCount: number
  dungeonID: string
  dungeonImg: string
  dungeonName: string
  dungeonNameShort: string
  dungeonSlug: string
}

export interface CurrentDungeon {
  dungeon_id: number
  dungeon_name: string
  dungeon_short_name: string
  dungeon_slug: string
  expansion: number
  dungeon_img: string
  boss_count: number
  is_current: boolean
}

interface DungeonInfo {
  level: number
  inTime: boolean
  rating: number | 0.0
  affix1: string
  affix2: string
  affix3: string
}

export interface Character {
  characterName: string
  characterRealm: string
  characterILevel: number | 0
  characterRating: number | 0.0
  characterRatingColor: string
  characterRace: string | null
  characterClass: WoWClass | null
  characterSpec: string | null
  dungeons: Array<Dungeon>
}
