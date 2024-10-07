export const ClassColours = {
  'Death Knight': '#C41F3B',
  'Demon Hunter': '#A330C9',
  Druid: '#FF7D0A',
  Evoker: '#33937F',
  Hunter: '#A9D271',
  Mage: '#40C7EB',
  Monk: '#00FF96',
  Paladin: '#F58CBA',
  Priest: '#FFFFFF',
  Rogue: '#FFF569',
  Shaman: '#0070DE',
  Warlock: '#8787ED',
  Warrior: '#C79C6E'
} as const

export type WoWClass = keyof typeof ClassColours

export const scoreColours = {
  TopThree: '#e6cc80',
  Orange: '#ff8000',
  Purple: '#a335ee',
  Blue: '#0070dd',
  White: '#fff'
}
