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

/**
 * Nem toda species tem uma variedade com o mesmo nome.
 * Ex.: /pokemon-species/deoxys existe, mas /pokemon/deoxys dá 404 —
 * a variedade padrão se chama "deoxys-normal".
 * Mesma coisa com giratina (altered), shaymin (land), wormadam (plant),
 * basculin, darmanitan, tornadus, keldeo, meloetta, aegislash, zygarde,
 * lycanroc, mimikyu, toxtricity, urshifu, maushold, palafin, dudunsparce…
 */
async function defaultVarietyName(idOrName: string | number): Promise<string> {
  const species = await get<PokemonSpecies>(`${BASE}/pokemon-species/${idOrName}/`)
  const def = species.varieties.find(v => v.is_default) ?? species.varieties[0]
  if (!def) throw new Error(`Species sem variedades: ${idOrName}`)
  return def.pokemon.name
}

/** Tenta pelo nome dado; se falhar, resolve a variedade padrão da species. */
async function getResolved<T>(
  buildUrl: (n: string | number) => string,
  idOrName: string | number,
): Promise<T> {
  try {
    return await get<T>(buildUrl(idOrName))
  } catch {
    const variety = await defaultVarietyName(idOrName)
    return get<T>(buildUrl(variety))
  }
}

export const api = {
  getVersionGroups: () => get<VersionGroupList>(`${BASE}/version-group/?limit=100`),
  getVersionGroup: (name: string) => get<VersionGroup>(`${BASE}/version-group/${name}/`),
  getPokedex: (id: string | number) => get<Pokedex>(`${BASE}/pokedex/${id}/`),
  getMoveDetail: (idOrName: string | number) => get<MoveDetail>(`${BASE}/move/${idOrName}/`),
  getEvolutionChain: (url: string) => get<EvolutionChain>(url),

  getPokemon: (idOrName: string | number) =>
    getResolved<Pokemon>(n => `${BASE}/pokemon/${n}/`, idOrName),

  getPokemonEncounters: (idOrName: string | number) =>
    getResolved<PokemonEncounter[]>(n => `${BASE}/pokemon/${n}/encounters`, idOrName),

  /** Caminho inverso: se receber o nome de uma variedade (ex.: "deoxys-attack"),
   *  cai no /pokemon e segue a URL da species. */
  getPokemonSpecies: async (idOrName: string | number): Promise<PokemonSpecies> => {
    try {
      return await get<PokemonSpecies>(`${BASE}/pokemon-species/${idOrName}/`)
    } catch {
      const p = await get<Pokemon>(`${BASE}/pokemon/${idOrName}/`)
      return get<PokemonSpecies>(p.species.url)
    }
  },
}
