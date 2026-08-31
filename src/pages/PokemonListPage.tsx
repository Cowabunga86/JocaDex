import { ArrowLeft, Heart, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { TYPE_COLORS, TYPE_NAMES_PT } from '../constants/typeColors'
import { GAME_BY_SLUG } from '../constants/games'
import { usePokedex, usePokemon } from '../hooks/usePokeAPI'
import { useFavorites } from '../hooks/useFavorites'
import { displayName } from '../constants/names'
import type { PokemonEntry } from '../types/pokeapi'

// All 18 types for the filter strip
const ALL_TYPES = Object.keys(TYPE_COLORS)

// Card de Pokémon individual
function PokemonCard({
  entry,
  gameSlug,
  typeFilters,
}: {
  entry: PokemonEntry
  gameSlug: string
  typeFilters: string[]
}) {
  const navigate = useNavigate()
  const name = entry.pokemon_species.name
  const number = entry.entry_number
  // O ID nacional vem da URL da species. entry_number é o número REGIONAL —
  // usá-lo como ID nacional trocava o sprite (Johto #1 mostrava Bulbasaur).
  const nationalId = Number(entry.pokemon_species.url.split('/').filter(Boolean).pop())
  const { data: pokemon } = usePokemon(name)
  const { isFavorite, toggle } = useFavorites()

  const spriteUrl = pokemon?.sprites.front_default
    ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nationalId}.png`

  const types = pokemon?.types ?? []

  // Type filter: hide cards that don't match ALL selected types
  if (typeFilters.length > 0 && pokemon && !typeFilters.every(tf => types.some(t => t.type.name === tf))) {
    return null
  }

  const fav = isFavorite(name)

  return (
    <div className="relative flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-all dark:bg-gray-800/60">
      <button
        onClick={() => navigate(`/game/${gameSlug}/pokemon/${name}`)}
        className="flex flex-1 items-center gap-3 text-left"
      >
        <img
          src={spriteUrl}
          alt={displayName(name)}
          width={56}
          height={56}
          className="shrink-0 drop-shadow-sm"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-gray-400">#{String(number).padStart(3, '0')}</span>
            <span className="truncate font-semibold text-gray-900 dark:text-white">{displayName(name)}</span>
          </div>
          <div className="mt-1 flex gap-1">
            {types.map(t => {
              const color = TYPE_COLORS[t.type.name]
              return (
                <span
                  key={t.type.name}
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                  style={{ backgroundColor: color?.bg ?? '#aaa', color: color?.text ?? '#fff' }}
                >
                  {TYPE_NAMES_PT[t.type.name] ?? t.type.name}
                </span>
              )
            })}
          </div>
        </div>
      </button>

      {/* Favorite button */}
      <button
        onClick={e => { e.stopPropagation(); toggle(name) }}
        className="shrink-0 rounded-full p-1.5 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-90"
        title={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Heart
          size={16}
          className={fav ? 'fill-red-400 text-red-400' : 'text-gray-300 dark:text-gray-600'}
        />
      </button>
    </div>
  )
}

export function PokemonListPage() {
  const { gameId = '' } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [showFavOnly, setShowFavOnly] = useState(false)
  const [sortMode, setSortMode] = useState<'number' | 'name'>('number')
  const { favorites } = useFavorites()

  const game = GAME_BY_SLUG[gameId]
  const { data: pokedex, isLoading, isError } = usePokedex(game?.pokedexId ?? '')

  const filtered = useMemo(() => {
    if (!pokedex) return []
    const q = search.trim().toLowerCase()
    const entries = pokedex.pokemon_entries.filter(e => {
      if (showFavOnly && !favorites.includes(e.pokemon_species.name)) return false
      if (!q) return true
      return (
        e.pokemon_species.name.includes(q) ||
        displayName(e.pokemon_species.name).toLowerCase().includes(q) ||
        String(e.entry_number).includes(q)
      )
    })
    if (sortMode === 'name') {
      return [...entries].sort((a, b) =>
        displayName(a.pokemon_species.name).localeCompare(displayName(b.pokemon_species.name))
      )
    }
    return entries // already in pokédex order (by number)
  }, [pokedex, search, showFavOnly, favorites, sortMode])


  return (
    <div className="page-enter min-h-svh bg-white dark:bg-gray-950">
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-4 pb-2 pt-3 shadow-md"
        style={{ backgroundColor: game?.color ?? '#CC0000' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="shrink-0 rounded-full p-1 text-white/80 hover:bg-white/20"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1
              className="truncate text-[11px] font-black leading-none text-white"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {game?.name ?? gameId}
            </h1>
            {pokedex && (
              <p className="mt-1.5 text-xs text-white/70">
                {pokedex.pokemon_entries.length} Pokémon
              </p>
            )}
          </div>
          {/* Favorites toggle */}
          <button
            onClick={() => setShowFavOnly(v => !v)}
            className={[
              'shrink-0 rounded-full p-2 transition-all',
              showFavOnly ? 'bg-red-400' : 'bg-white/20 hover:bg-white/30',
            ].join(' ')}
            title={showFavOnly ? 'Mostrar todos' : 'Mostrar favoritos'}
          >
            <Heart size={16} className={showFavOnly ? 'fill-white text-white' : 'text-white/80'} />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mt-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Nome ou número..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl bg-white/95 py-2 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50 dark:bg-gray-900 dark:text-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort + type filter row */}
        <div className="mt-2 flex items-center gap-2">
          {/* Sort toggle */}
          <div className="flex shrink-0 rounded-lg bg-white/20 p-0.5">
            {(['number', 'name'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setSortMode(mode)}
                className={[
                  'rounded-md px-2.5 py-1 text-[10px] font-bold transition-all',
                  sortMode === mode ? 'bg-white text-gray-800' : 'text-white/80 hover:text-white',
                ].join(' ')}
              >
                {mode === 'number' ? '#' : 'A-Z'}
              </button>
            ))}
          </div>

          {/* Type filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
          {/* "Todos" chip */}
          <button
            onClick={() => setTypeFilters([])}
            className={[
              'shrink-0 rounded-full px-3 py-1 text-[10px] font-bold transition-all',
              typeFilters.length === 0
                ? 'bg-white text-gray-800'
                : 'bg-white/20 text-white hover:bg-white/30',
            ].join(' ')}
          >
            Todos
          </button>
          {ALL_TYPES.map(type => {
            const color = TYPE_COLORS[type]
            const active = typeFilters.includes(type)
            return (
              <button
                key={type}
                onClick={() => setTypeFilters(prev => active ? prev.filter(t => t !== type) : [...prev, type])}
                className="shrink-0 rounded-full px-3 py-1 text-[10px] font-bold transition-all"
                style={
                  active
                    ? { backgroundColor: '#fff', color: color.bg }
                    : { backgroundColor: color.bg + '99', color: '#fff', border: `1px solid ${color.bg}` }
                }
              >
                {TYPE_NAMES_PT[type] ?? type}
              </button>
            )
          })}
          </div>
        </div>
      </header>

      {/* Lista */}
      <main className="mx-auto max-w-lg px-4 py-4">
        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-3 rounded-xl bg-gray-100 p-3 dark:bg-gray-800">
                <div className="h-14 w-14 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="py-12 text-center text-gray-400">
            <p className="text-4xl">😵</p>
            <p className="mt-2 font-medium">Pokédex não encontrada para este jogo.</p>
            <button onClick={() => navigate('/')} className="mt-4 text-sm text-blue-500 underline">
              Voltar ao início
            </button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <p className="text-4xl">{showFavOnly ? '💔' : '🔍'}</p>
            <p className="mt-2">
              {showFavOnly
                ? 'Nenhum favorito neste jogo ainda.'
                : `Nenhum Pokémon encontrado para "${search}"`}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {filtered.map(entry => (
            <PokemonCard
              key={entry.pokemon_species.name}
              entry={entry}
              gameSlug={gameId}
              typeFilters={typeFilters}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
