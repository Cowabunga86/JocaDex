export interface GameInfo {
  slug: string
  apiVersionGroup?: string  // nome no PokeAPI quando diferente do slug
  noEncounterData?: boolean // PokeAPI não tem dados de encontro para este jogo
  name: string
  generation: number
  color: string
  color2?: string           // segunda cor para degradê (jogos com duas versões)
  textColor: string
  pokedexId: string | number
  coverPokemon: number[]    // IDs dos Pokémon de capa (1 ou 2)
}

export const GAMES: GameInfo[] = [
  // Geração I
  { slug: 'red-blue',           name: 'Red / Blue',              generation: 1, color: '#CC0000', color2: '#1D4ED8', textColor: '#fff', pokedexId: 2,  coverPokemon: [6, 9]       }, // Charizard, Blastoise
  { slug: 'yellow',             name: 'Yellow',                  generation: 1, color: '#F8D030', textColor: '#333', pokedexId: 2,  coverPokemon: [25]         }, // Pikachu
  // Geração II
  { slug: 'gold-silver',        name: 'Gold / Silver',           generation: 2, color: '#B8860B', color2: '#64748B', textColor: '#fff', pokedexId: 7,  coverPokemon: [250, 249]   }, // Ho-Oh, Lugia
  { slug: 'crystal',            name: 'Crystal',                 generation: 2, color: '#0EA5E9', textColor: '#fff', pokedexId: 7,  coverPokemon: [245]        }, // Suicune
  // Geração III
  { slug: 'ruby-sapphire',      name: 'Ruby / Sapphire',         generation: 3, color: '#B91C1C', color2: '#1E3A8A', textColor: '#fff', pokedexId: 15, coverPokemon: [383, 382]   }, // Groudon, Kyogre
  { slug: 'emerald',            name: 'Emerald',                 generation: 3, color: '#15803D', textColor: '#fff', pokedexId: 15, coverPokemon: [384]        }, // Rayquaza
  { slug: 'firered-leafgreen',  name: 'FireRed / LeafGreen',     generation: 10, color: '#EA580C', color2: '#16A34A', textColor: '#fff', pokedexId: 2,  coverPokemon: [6, 3]       }, // Charizard, Venusaur
  // Geração IV
  { slug: 'diamond-pearl',      name: 'Diamond / Pearl',         generation: 4, color: '#4F46E5', color2: '#BE185D', textColor: '#fff', pokedexId: 16, coverPokemon: [483, 484]   }, // Dialga, Palkia
  { slug: 'platinum',           name: 'Platinum',                generation: 4, color: '#475569', textColor: '#fff', pokedexId: 16, coverPokemon: [487]        }, // Giratina
  { slug: 'heartgold-soulsilver', name: 'HeartGold / SoulSilver', generation: 10, color: '#B45309', color2: '#64748B', textColor: '#fff', pokedexId: 7, coverPokemon: [250, 249]   }, // Ho-Oh, Lugia
  // Geração V
  { slug: 'black-white',        name: 'Black / White',           generation: 5, color: '#1C1917', color2: '#94A3B8', textColor: '#fff', pokedexId: 21, coverPokemon: [643, 644]   }, // Reshiram, Zekrom
  { slug: 'black-2-white-2',    name: 'Black 2 / White 2',       generation: 5, color: '#111827', color2: '#9CA3AF', textColor: '#fff', pokedexId: 21, coverPokemon: [10022, 10023] }, // Kyurem-Black, Kyurem-White
  // Geração VI
  { slug: 'x-y',                name: 'X / Y',                  generation: 6, color: '#1D4ED8', color2: '#BE123C', textColor: '#fff', pokedexId: 12, coverPokemon: [716, 717]   }, // Xerneas, Yveltal
  { slug: 'omega-ruby-alpha-sapphire', name: 'Omega Ruby / Alpha Sapphire', generation: 10, color: '#9F1239', color2: '#1E3A8A', textColor: '#fff', pokedexId: 15, coverPokemon: [383, 382] },
  // Geração VII
  { slug: 'sun-moon',           name: 'Sun / Moon',              generation: 7, color: '#D97706', color2: '#4C1D95', textColor: '#fff', pokedexId: 21, coverPokemon: [791, 792]   }, // Solgaleo, Lunala
  { slug: 'ultra-sun-ultra-moon', name: 'Ultra Sun / Ultra Moon', generation: 7, color: '#92400E', color2: '#3B0764', textColor: '#fff', pokedexId: 21, coverPokemon: [10155, 10156] }, // Necrozma formes
  // Geração VIII
  { slug: 'sword-shield',       name: 'Sword / Shield',          generation: 8, color: '#0369A1', color2: '#BE123C', textColor: '#fff', pokedexId: 27, coverPokemon: [888, 889]   }, // Zacian, Zamazenta
  { slug: 'brilliant-diamond-shining-pearl', apiVersionGroup: 'diamond-pearl', name: 'B. Diamond / S. Pearl', generation: 10, color: '#4F46E5', color2: '#DB2777', textColor: '#fff', pokedexId: 16, coverPokemon: [483, 484] }, // Dialga, Palkia — PokeAPI usa diamond/pearl para BDSP
  { slug: 'the-isle-of-armor',  name: 'Isle of Armor DLC',       generation: 8, color: '#047857', textColor: '#fff', pokedexId: 28, coverPokemon: [891]        }, // Kubfu
  { slug: 'legends-arceus',    name: 'Legends: Arceus',         generation: 11, color: '#78350F', color2: '#D97706', textColor: '#fff', pokedexId: 'hisui',        coverPokemon: [493],       noEncounterData: true }, // Arceus
  // Geração IX
  { slug: 'scarlet-violet',     name: 'Scarlet / Violet',        generation: 9, color: '#9F1239', color2: '#5B21B6', textColor: '#fff', pokedexId: 31, coverPokemon: [1007, 1008], noEncounterData: true }, // Koraidon, Miraidon — PokeAPI não tem dados de encontro para SV
  { slug: 'legends-za',         name: 'Legends: Z-A',            generation: 11, color: '#0F172A', color2: '#EAB308', textColor: '#fff', pokedexId: 'lumiose-city', coverPokemon: [150],       noEncounterData: true }, // Mewtwo
]

export const GAME_BY_SLUG = Object.fromEntries(GAMES.map(g => [g.slug, g]))

export const GEN_LABELS: Record<number, string> = {
  1: 'Geração I — Kanto',
  2: 'Geração II — Johto',
  3: 'Geração III — Hoenn',
  4: 'Geração IV — Sinnoh',
  5: 'Geração V — Unova',
  6: 'Geração VI — Kalos',
  7: 'Geração VII — Alola',
  8: 'Geração VIII — Galar',
  9: 'Geração IX — Paldea',
  10: 'Remakes',
  11: 'Legends',
}

export function spriteUrl(id: number): string {
  // Formes especiais (10000+) usam path diferente no repo de sprites
  if (id >= 10000) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}
