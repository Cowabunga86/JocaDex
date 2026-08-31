export interface NamedAPIResource {
  name: string
  url: string
}
export interface VersionGroupList {
  count: number
  results: NamedAPIResource[]
}
export interface VersionGroup {
  id: number
  name: string
  order: number
  generation: NamedAPIResource
  versions: NamedAPIResource[]
  pokedexes: NamedAPIResource[]
}
export interface PokemonEntry {
  entry_number: number
  pokemon_species: NamedAPIResource
}
export interface Pokedex {
  id: number
  name: string
  pokemon_entries: PokemonEntry[]
}
export interface PokemonType {
  slot: number
  type: NamedAPIResource
}
export interface PokemonSprites {
  front_default: string | null
  front_shiny: string | null
  back_default: string | null
  back_shiny: string | null
}
export interface MoveVersionGroupDetail {
  level_learned_at: number
  move_learn_method: NamedAPIResource
  version_group: NamedAPIResource
}
export interface PokemonMove {
  move: NamedAPIResource
  version_group_details: MoveVersionGroupDetail[]
}
export interface PokemonStat {
  base_stat: number
  effort: number
  stat: NamedAPIResource
}
export interface Pokemon {
  id: number
  name: string
  base_experience: number
  height: number
  weight: number
  types: PokemonType[]
  sprites: PokemonSprites
  moves: PokemonMove[]
  stats: PokemonStat[]
}
export interface FlavorTextEntry {
  flavor_text: string
  language: NamedAPIResource
  version: NamedAPIResource
}
export interface PokemonSpecies {
  id: number
  name: string
  capture_rate: number
  habitat: NamedAPIResource | null
  evolution_chain: { url: string }
  flavor_text_entries: FlavorTextEntry[]
  genera: { genus: string; language: NamedAPIResource }[]
  varieties: { is_default: boolean; pokemon: NamedAPIResource }[]
}
export interface MoveDetail {
  id: number
  name: string
  accuracy: number | null
  power: number | null
  pp: number
  type: NamedAPIResource
  damage_class: NamedAPIResource
  effect_entries: { effect: string; short_effect: string; language: NamedAPIResource }[]
}
export interface EncounterVersionDetail {
  max_chance: number
  encounter_details: { min_level: number; max_level: number; chance: number; method: NamedAPIResource }[]
  version: NamedAPIResource
}
export interface PokemonEncounter {
  location_area: NamedAPIResource
  version_details: EncounterVersionDetail[]
}
export interface EvolutionDetail {
  min_level: number | null
  trigger: NamedAPIResource
  item: NamedAPIResource | null
  held_item: NamedAPIResource | null
  known_move: NamedAPIResource | null
  min_happiness: number | null
  min_beauty: number | null
  time_of_day: string
  needs_overworld_rain: boolean
  turn_upside_down: boolean
}
export interface ChainLink {
  is_baby: boolean
  species: NamedAPIResource
  evolution_details: EvolutionDetail[]
  evolves_to: ChainLink[]
}
export interface EvolutionChain {
  id: number
  chain: ChainLink
}
