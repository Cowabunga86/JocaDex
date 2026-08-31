import type {
  MoveDetail, PokemonEncounter, Pokemon,
  PokemonSpecies, Pokedex, VersionGroup, VersionGroupList, EvolutionChain,
} from '../types/pokeapi'

const BASE = 'https://pokeapi.co/api/v2'

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`PokeAPI error ${res.status}: ${url}`)
  return res.json() as Promise<T>
}

export const api = {
  getVersionGroups: () => get<VersionGroupList>(`${BASE}/version-group/?limit=100`),
  getVersionGroup: (name: string) => get<VersionGroup>(`${BASE}/version-group/${name}/`),
  getPokedex: (id: string | number) => get<Pokedex>(`${BASE}/pokedex/${id}/`),
  getPokemon: (idOrName: string | number) => get<Pokemon>(`${BASE}/pokemon/${idOrName}/`),
  getPokemonSpecies: (idOrName: string | number) => get<PokemonSpecies>(`${BASE}/pokemon-species/${idOrName}/`),
  getMoveDetail: (idOrName: string | number) => get<MoveDetail>(`${BASE}/move/${idOrName}/`),
  getPokemonEncounters: (idOrName: string | number) => get<PokemonEncounter[]>(`${BASE}/pokemon/${idOrName}/encounters`),
  getEvolutionChain: (url: string) => get<EvolutionChain>(url),
}
