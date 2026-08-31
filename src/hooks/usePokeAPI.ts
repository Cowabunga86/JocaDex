import { useQuery } from '@tanstack/react-query'
import { api } from '../api/pokeapi'

export function useVersionGroups() {
  return useQuery({ queryKey: ['version-groups'], queryFn: () => api.getVersionGroups(), staleTime: 1000 * 60 * 60 * 24 })
}
export function useVersionGroup(name: string) {
  return useQuery({ queryKey: ['version-group', name], queryFn: () => api.getVersionGroup(name), staleTime: Infinity, enabled: !!name })
}
export function usePokedex(id: string | number) {
  return useQuery({ queryKey: ['pokedex', id], queryFn: () => api.getPokedex(id), staleTime: Infinity, enabled: !!id })
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
