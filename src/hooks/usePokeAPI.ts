import { useQuery } from '@tanstack/react-query'
import { api } from '../api/pokeapi'
import type { Pokedex, PokemonEntry } from '../types/pokeapi'

export function useVersionGroups() {
  return useQuery({ queryKey: ['version-groups'], queryFn: () => api.getVersionGroups(), staleTime: 1000 * 60 * 60 * 24 })
}
export function useVersionGroup(name: string) {
  return useQuery({ queryKey: ['version-group', name], queryFn: () => api.getVersionGroup(name), staleTime: Infinity, enabled: !!name })
}
/**
 * Aceita um ou vários pokédex. Kalos (X/Y) é dividido em três
 * (central, coastal, mountain) — sem juntar, faltariam ~2/3 dos Pokémon.
 * Ao juntar, remove duplicatas e renumera em sequência.
 */
export function usePokedex(id: string | number | (string | number)[]) {
  const ids = Array.isArray(id) ? id : [id]
  return useQuery({
    queryKey: ['pokedex', ids],
    queryFn: async (): Promise<Pokedex> => {
      const dexes = await Promise.all(ids.map(i => api.getPokedex(i)))
      if (dexes.length === 1) return dexes[0]

      const seen = new Set<string>()
      const entries: PokemonEntry[] = []
      for (const dex of dexes) {
        for (const e of dex.pokemon_entries) {
          if (seen.has(e.pokemon_species.name)) continue
          seen.add(e.pokemon_species.name)
          entries.push({ entry_number: entries.length + 1, pokemon_species: e.pokemon_species })
        }
      }
      return { id: dexes[0].id, name: dexes.map(d => d.name).join(' + '), pokemon_entries: entries }
    },
    staleTime: Infinity,
    enabled: ids.length > 0 && ids.every(i => !!i),
  })
}
export function usePokemon(idOrName: string | number) {
  return useQuery({ queryKey: ['pokemon', idOrName], queryFn: () => api.getPokemon(idOrName), staleTime: Infinity, enabled: !!idOrName })
}
export function usePokemonSpecies(idOrName: string | number) {
  return useQuery({ queryKey: ['pokemon-species', idOrName], queryFn: () => api.getPokemonSpecies(idOrName), staleTime: Infinity, enabled: !!idOrName })
}
export function useMoveDetail(idOrName: string | number, enabled = false) {
  return useQuery({ queryKey: ['move', idOrName], queryFn: () => api.getMoveDetail(idOrName), staleTime: Infinity, enabled: !!idOrName && enabled })
}
export function usePokemonEncounters(idOrName: string | number) {
  return useQuery({ queryKey: ['encounters', idOrName], queryFn: () => api.getPokemonEncounters(idOrName), staleTime: Infinity, enabled: !!idOrName })
}
export function useEvolutionChain(url: string) {
  return useQuery({ queryKey: ['evolution-chain', url], queryFn: () => api.getEvolutionChain(url), staleTime: Infinity, enabled: !!url })
}
