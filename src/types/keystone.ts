interface Dungeon {
  dungeonName: string
  bestTyrannical: DungeonInfo | null
  bestFortified: DungeonInfo | null
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
  characterRace: string | null
  characterClass: string | null
  characterSpec: string | null
  dungeons: Array<Dungeon>
}
