import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react'
import { GAME_BY_SLUG } from '../constants/games'
import { TYPE_COLORS, TYPE_NAMES_PT } from '../constants/typeColors'
import { computeMatchups } from '../constants/typeChart'
import {
  usePokemon, usePokemonSpecies, usePokemonEncounters,
  useVersionGroup, useMoveDetail, useEvolutionChain, usePokedex,
} from '../hooks/usePokeAPI'
import { useFavorites } from '../hooks/useFavorites'
import type { ChainLink, EvolutionDetail } from '../types/pokeapi'
import { displayName } from '../constants/names'


// ─── Lookup de nomes de formas especiais ──────────────────────────────────
const FORM_LABELS: Record<string, string> = {
  mega:   'Mega',
  'mega-x': 'Mega X',
  'mega-y': 'Mega Y',
  gmax:   'Gigantamax',
}

function getFormLabel(baseName: string, varietyName: string): string {
  const suffix = varietyName.startsWith(`${baseName}-`)
    ? varietyName.slice(baseName.length + 1)
    : varietyName
  return FORM_LABELS[suffix] ?? suffix.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// ─── Card de forma especial ───────────────────────────────────────────────
function SpecialFormCard({
  name,
  label,
}: {
  name: string
  label: string
}) {
  const { data: form } = usePokemon(name)
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-700">
      {form ? (
        <img
          src={form.sprites.front_default ?? ''}
          alt={displayName(name)}
          width={72}
          height={72}
          style={{ imageRendering: 'pixelated' }}
          className="drop-shadow"
          onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
        />
      ) : (
        <div className="h-[72px] w-[72px] animate-pulse rounded-full bg-gray-200 dark:bg-gray-600" />
      )}
      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{label}</span>
      {form && (
        <div className="flex flex-wrap justify-center gap-1">
          {form.types.map(t => <TypeChip key={t.type.name} type={t.type.name} />)}
        </div>
      )}
    </div>
  )
}

// ─── Mapeamento de stats ───────────────────────────────────────────────────
const STAT_INFO: Record<string, { label: string; color: string }> = {
  hp:               { label: 'PS',        color: '#4CAF50' },
  attack:           { label: 'Ataque',    color: '#F44336' },
  defense:          { label: 'Defesa',    color: '#FFC107' },
  'special-attack': { label: 'Atq. Esp.', color: '#2196F3' },
  'special-defense':{ label: 'Def. Esp.', color: '#009688' },
  speed:            { label: 'Veloc.',    color: '#E91E63' },
}
const MAX_STAT = 255

// ─── Categorias de movimento ──────────────────────────────────────────────
const DAMAGE_CLASS: Record<string, { label: string; color: string; bg: string }> = {
  physical: { label: 'Físico',   color: '#fff', bg: '#C03028' },
  special:  { label: 'Especial', color: '#fff', bg: '#6050DC' },
  status:   { label: 'Status',   color: '#333', bg: '#A8A878' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function cleanText(t: string) {
  return t.replace(/\f/g, ' ').replace(/\n/g, ' ')
}
function pad(n: number) {
  return String(n).padStart(3, '0')
}
function idFromUrl(url: string): number {
  return parseInt(url.split('/').filter(Boolean).pop() ?? '0')
}
function spriteFromId(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}
function evoTriggerText(details: EvolutionDetail[]): string {
  if (!details.length) return '→'
  const d = details[0]
  if (d.min_level)     return `Nv. ${d.min_level}`
  if (d.item)          return d.item.name.replace(/-/g, ' ')
  if (d.held_item)     return d.held_item.name.replace(/-/g, ' ')
  if (d.min_happiness) return 'Felicidade'
  if (d.trigger?.name === 'trade') return 'Troca'
  if (d.time_of_day === 'day')   return 'Dia'
  if (d.time_of_day === 'night') return 'Noite'
  return '→'
}

function flattenChain(link: ChainLink): ChainLink[][] {
  if (link.evolves_to.length === 0) return [[link]]
  const paths: ChainLink[][] = []
  for (const next of link.evolves_to) {
    for (const sub of flattenChain(next)) {
      paths.push([link, ...sub])
    }
  }
  return paths
}

// ─── Type chip helper ─────────────────────────────────────────────────────
function TypeChip({ type }: { type: string }) {
  const c = TYPE_COLORS[type]
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
      style={{ backgroundColor: c?.bg ?? '#aaa', color: c?.text ?? '#fff' }}
    >
      {TYPE_NAMES_PT[type] ?? type}
    </span>
  )
}

// ─── Seção de fraquezas / resistências ───────────────────────────────────
function TypeMatchupsSection({ types }: { types: string[] }) {
  const m = computeMatchups(types)

  const rows = [
    { label: '4× Fraco',   list: m.weak4,   bg: '#FEE2E2', text: '#991B1B', show: m.weak4.length > 0 },
    { label: '2× Fraco',   list: m.weak2,   bg: '#FEF3C7', text: '#92400E', show: m.weak2.length > 0 },
    { label: '½× Resist.', list: m.resist2, bg: '#DCFCE7', text: '#166534', show: m.resist2.length > 0 },
    { label: '¼× Resist.', list: m.resist4, bg: '#BBF7D0', text: '#14532D', show: m.resist4.length > 0 },
    { label: 'Imune',       list: m.immune,  bg: '#F3F4F6', text: '#374151', show: m.immune.length > 0 },
  ].filter(r => r.show)

  if (rows.length === 0) return null

  return (
    <section className="mb-4 rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
      <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        Fraquezas &amp; Resistências
      </h2>
      <div className="flex flex-col gap-2">
        {rows.map(row => (
          <div key={row.label} className="flex items-start gap-2">
            <span
              className="shrink-0 rounded-lg px-2 py-0.5 text-[9px] font-bold w-20 text-center"
              style={{ backgroundColor: row.bg, color: row.text }}
            >
              {row.label}
            </span>
            <div className="flex flex-wrap gap-1">
              {row.list.map(t => <TypeChip key={t} type={t} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Cadeia evolutiva ─────────────────────────────────────────────────────
function EvolutionRow({
  path,
  currentName,
  onNavigate,
}: {
  path: ChainLink[]
  currentName: string
  onNavigate: (name: string) => void
}) {
  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      {path.map((link, i) => {
        const speciesId = idFromUrl(link.species.url)
        const isCurrent = link.species.name === currentName
        const triggerText = i > 0
          ? evoTriggerText(
              path[i - 1].evolves_to.find(e => e.species.name === link.species.name)?.evolution_details
              ?? link.evolution_details
            )
          : null

        return (
          <div key={link.species.name} className="flex items-center gap-1">
            {i > 0 && (
              <div className="flex flex-col items-center mx-1">
                <span className="text-[9px] font-semibold text-gray-400 whitespace-nowrap leading-tight">
                  {triggerText}
                </span>
                <span className="text-gray-300 dark:text-gray-600 text-lg leading-none">→</span>
              </div>
            )}
            <button
              onClick={() => onNavigate(link.species.name)}
              disabled={isCurrent}
              className={[
                'flex flex-col items-center rounded-xl px-2 py-1.5 transition-all',
                isCurrent
                  ? 'bg-gray-100 dark:bg-gray-700 ring-2 ring-gray-400 cursor-default'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95',
              ].join(' ')}
            >
              <img
                src={spriteFromId(speciesId)}
                alt={link.species.name}
                width={52}
                height={52}
                style={{ imageRendering: 'pixelated' }}
                className="drop-shadow-sm"
                onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
              />
              <span className={[
                'text-[9px] font-semibold mt-0.5',
                isCurrent ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400',
              ].join(' ')}>
                {displayName(link.species.name)}
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ─── Bottom sheet de detalhes do movimento ────────────────────────────────
function MoveSheet({ moveName, onClose }: { moveName: string; onClose: () => void }) {
  const { data: move, isLoading } = useMoveDetail(moveName, true)
  const typeColor = move ? TYPE_COLORS[move.type.name] : null
  const cls = move ? (DAMAGE_CLASS[move.damage_class.name] ?? DAMAGE_CLASS.status) : null
  const effect = move?.effect_entries.find(e => e.language.name === 'en')?.short_effect ?? ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl bg-white px-6 pb-10 pt-5 shadow-2xl dark:bg-gray-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />

        {isLoading || !move ? (
          <div className="flex flex-col gap-3 py-4">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-between gap-3">
              <h3
                className="text-xs font-bold capitalize leading-snug text-gray-900 dark:text-white"
                style={{ fontFamily: "'Press Start 2P', monospace", maxWidth: '60%' }}
              >
                {move.name.replace(/-/g, ' ')}
              </h3>
              <div className="flex shrink-0 gap-1.5">
                {typeColor && (
                  <span className="rounded-full px-3 py-1 text-[11px] font-bold"
                    style={{ backgroundColor: typeColor.bg, color: typeColor.text }}>
                    {TYPE_NAMES_PT[move.type.name] ?? move.type.name}
                  </span>
                )}
                {cls && (
                  <span className="rounded-full px-3 py-1 text-[11px] font-bold"
                    style={{ backgroundColor: cls.bg, color: cls.color }}>
                    {cls.label}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-3 divide-x divide-gray-100 rounded-2xl bg-gray-50 py-3 dark:divide-gray-700 dark:bg-gray-700">
              {[
                { label: 'Força',    value: move.power    != null ? move.power    : '—' },
                { label: 'Precisão', value: move.accuracy != null ? `${move.accuracy}%` : '—' },
                { label: 'PP',       value: move.pp },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center gap-0.5 px-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
                  <span className="text-lg font-black text-gray-800 dark:text-white">{value}</span>
                </div>
              ))}
            </div>

            {effect && (
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {effect.replace(/\$effect_chance/g, `${move.pp}`)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Skeleton de loading ──────────────────────────────────────────────────
function LoadingSkeleton({ color }: { color: string }) {
  return (
    <div className="page-enter min-h-svh bg-gray-50 dark:bg-gray-950">
      <header className="px-4 py-3 shadow-md" style={{ backgroundColor: color }}>
        <div className="h-6 w-32 animate-pulse rounded bg-white/30" />
      </header>
      <div className="mx-auto max-w-lg px-4 pt-8 flex flex-col items-center gap-4">
        <div className="h-40 w-40 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="w-full h-40 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700 mt-4" />
        <div className="w-full h-56 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────
export function PokemonDetailPage() {
  const { gameId = '', pokemonId = '' } = useParams()
  const navigate = useNavigate()
  const [shiny, setShiny] = useState(false)
  const [selectedMove, setSelectedMove] = useState<string | null>(null)
  const [moveTab, setMoveTab] = useState<'level' | 'tm'>('level')
  const { isFavorite, toggle: toggleFavorite } = useFavorites()

  const game = GAME_BY_SLUG[gameId]
  const headerBg = game?.color ?? '#CC0000'

  const { data: pokemon, isLoading } = usePokemon(pokemonId)
  const { data: species } = usePokemonSpecies(pokemonId)
  const { data: encounters } = usePokemonEncounters(pokemonId)
  const vgName = game?.apiVersionGroup ?? gameId
  const { data: versionGroup } = useVersionGroup(vgName)
  const { data: evolutionChain } = useEvolutionChain(species?.evolution_chain.url ?? '')
  const { data: pokedex } = usePokedex(game?.pokedexId ?? '')

  // ── Navigation ────────────────────────────────────────────────────────
  const pokedexEntries = pokedex?.pokemon_entries ?? []
  const currentIdx = pokedexEntries.findIndex(e => e.pokemon_species.name === pokemonId)
  const prevEntry = currentIdx > 0 ? pokedexEntries[currentIdx - 1] : null
  const nextEntry = currentIdx < pokedexEntries.length - 1 ? pokedexEntries[currentIdx + 1] : null

  const goToPokemon = (name: string) => navigate(`/game/${gameId}/pokemon/${name}`)

  // ── Sprite ────────────────────────────────────────────────────────────
  const sprite = shiny
    ? (pokemon?.sprites.front_shiny ?? pokemon?.sprites.front_default)
    : pokemon?.sprites.front_default

  // ── Flavor text ───────────────────────────────────────────────────────
  const flavorText = (() => {
    if (!species) return null
    const all = species.flavor_text_entries
    const gameVersions = new Set(versionGroup?.versions.map(v => v.name) ?? [])
    const isPt = (lang: string) => lang === 'pt-BR' || lang === 'pt'
    return (
      all.find(e => isPt(e.language.name) && gameVersions.has(e.version.name)) ??
      all.find(e => isPt(e.language.name)) ??
      all.find(e => e.language.name === 'en' && gameVersions.has(e.version.name)) ??
      all.find(e => e.language.name === 'en') ?? null
    )?.flavor_text ? cleanText(
      (all.find(e => isPt(e.language.name) && gameVersions.has(e.version.name)) ??
       all.find(e => isPt(e.language.name)) ??
       all.find(e => e.language.name === 'en' && gameVersions.has(e.version.name)) ??
       all.find(e => e.language.name === 'en'))!.flavor_text
    ) : null
  })()

  // ── Genus ─────────────────────────────────────────────────────────────
  const genus = species?.genera.find(
    g => g.language.name === 'pt-BR' || g.language.name === 'pt' || g.language.name === 'en'
  )?.genus

  // ── Movimentos aprendidos neste jogo ──────────────────────────────────
  const levelMoves = (() => {
    if (!pokemon) return []
    return pokemon.moves
      .flatMap(m => {
        const detail = m.version_group_details.find(
          d => d.version_group.name === vgName && d.move_learn_method.name === 'level-up'
        )
        if (!detail) return []
        return [{ name: m.move.name, level: detail.level_learned_at }]
      })
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
  })()

  const tmMoves = (() => {
    if (!pokemon) return []
    return pokemon.moves
      .flatMap(m => {
        const detail = m.version_group_details.find(
          d => d.version_group.name === vgName && d.move_learn_method.name === 'machine'
        )
        if (!detail) return []
        return [{ name: m.move.name }]
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  })()

  const hasMoves = levelMoves.length > 0 || tmMoves.length > 0
  const activeMoves = moveTab === 'level' ? levelMoves : tmMoves

  // ── Locais de encontro ────────────────────────────────────────────────
  const gameEncounters = (() => {
    if (!encounters || !versionGroup) return []
    const gameVersions = new Set(versionGroup.versions.map(v => v.name))
    return encounters
      .filter(e => e.version_details.some(v => gameVersions.has(v.version.name)))
      .map(e => {
        const detail = e.version_details.find(v => gameVersions.has(v.version.name))
        const levels = detail?.encounter_details ?? []
        const minLv = levels.length ? Math.min(...levels.map(d => d.min_level)) : 0
        const maxLv = levels.length ? Math.max(...levels.map(d => d.max_level)) : 0
        return { location: e.location_area.name.replace(/-/g, ' '), minLv, maxLv }
      })
  })()

  // ── Cadeia evolutiva ──────────────────────────────────────────────────
  const evoPaths = evolutionChain ? flattenChain(evolutionChain.chain) : null
  const uniqueEvoPaths = evoPaths?.filter((path, i, arr) => {
    const key = path.map(p => p.species.name).join('>')
    return arr.findIndex(p2 => p2.map(p => p.species.name).join('>') === key) === i
  })
  const hasEvolution = uniqueEvoPaths && uniqueEvoPaths.some(p => p.length > 1)


  // ── Formas especiais do jogo (Mega, Gigantamax…) ─────────────────────
  const specialForms = (() => {
    if (!species || !game?.mechanics) return []
    const filters = game.mechanics.filter(m => m.formFilter).map(m => m.formFilter!)
    if (!filters.length) return []
    return species.varieties
      .map(v => v.pokemon.name)
      .filter(n => n !== pokemon?.name && filters.some(f => n.includes(f)))
      .map(n => ({ name: n, label: getFormLabel(pokemon?.name ?? '', n) }))
  })()

  // ── Loading / erro ────────────────────────────────────────────────────
  if (isLoading) return <LoadingSkeleton color={headerBg} />

  if (!pokemon) {
    return (
      <div className="page-enter min-h-svh bg-gray-50 dark:bg-gray-950">
        <header className="px-4 py-4 shadow-md" style={{ backgroundColor: headerBg }}>
          <button onClick={() => navigate(-1)} className="text-white/80"><ArrowLeft size={20} /></button>
        </header>
        <div className="p-12 text-center text-gray-400">
          <p className="text-4xl">😵</p>
          <p className="mt-3 font-medium">Pokémon não encontrado.</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-blue-500 underline">Voltar</button>
        </div>
      </div>
    )
  }

  const fav = isFavorite(pokemonId)

  return (
    <div className="page-enter min-h-svh bg-gray-50 dark:bg-gray-950">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 px-4 py-3 shadow-md" style={{ backgroundColor: headerBg }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="shrink-0 rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/20 active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="min-w-0 flex-1">
            <h1
              className="truncate text-xs font-black leading-none text-white"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {displayName(species?.name ?? pokemon.name)}
            </h1>
            {genus && <p className="mt-1.5 text-xs text-white/70">{genus}</p>}
          </div>

          <span className="shrink-0 text-sm font-bold text-white/50">#{pad(pokemon.id)}</span>

          <button
            onClick={() => toggleFavorite(pokemonId)}
            className="shrink-0 rounded-full p-1.5 transition-all hover:bg-white/20 active:scale-90"
            title={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart size={18} className={fav ? 'fill-red-400 text-red-400' : 'text-white/60'} />
          </button>
        </div>

        {/* Prev / Next */}
        {pokedexEntries.length > 0 && (
          <div className="mt-2 flex items-center justify-between gap-2">
            {prevEntry ? (
              <button
                onClick={() => goToPokemon(prevEntry.pokemon_species.name)}
                className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white hover:bg-white/30 active:scale-95 transition-all"
              >
                <ChevronLeft size={12} />
                <span className="max-w-[90px] truncate">
                  {displayName(prevEntry.pokemon_species.name)}
                </span>
              </button>
            ) : <div />}
            {nextEntry ? (
              <button
                onClick={() => goToPokemon(nextEntry.pokemon_species.name)}
                className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white hover:bg-white/30 active:scale-95 transition-all"
              >
                <span className="max-w-[90px] truncate">
                  {displayName(nextEntry.pokemon_species.name)}
                </span>
                <ChevronRight size={12} />
              </button>
            ) : <div />}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-lg px-4 pb-12 pt-6">

        {/* ── Hero ── */}
        <section className="mb-6 flex flex-col items-center">
          <div className="relative">
            <img
              src={sprite ?? ''}
              alt={pokemon.name}
              width={160}
              height={160}
              className="drop-shadow-xl"
              style={{ imageRendering: 'pixelated' }}
            />
            <button
              onClick={() => setShiny(s => !s)}
              title={shiny ? 'Ver normal' : 'Ver shiny ✨'}
              className={[
                'absolute -right-2 -top-2 rounded-full p-2 shadow-md transition-all duration-200',
                shiny ? 'bg-yellow-400 text-yellow-900 scale-110' : 'bg-white/90 text-gray-400 dark:bg-gray-700',
              ].join(' ')}
            >
              <Sparkles size={16} />
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            {pokemon.types.map(t => {
              const c = TYPE_COLORS[t.type.name]
              return (
                <span key={t.type.name} className="rounded-full px-5 py-1 text-sm font-bold"
                  style={{ backgroundColor: c?.bg ?? '#aaa', color: c?.text ?? '#fff' }}>
                  {TYPE_NAMES_PT[t.type.name] ?? t.type.name}
                </span>
              )
            })}
          </div>

          <div className="mt-3 flex gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="font-bold text-gray-800 dark:text-gray-100">{(pokemon.height / 10).toFixed(1)} m</p>
              <p className="text-xs">Altura</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800 dark:text-gray-100">{(pokemon.weight / 10).toFixed(1)} kg</p>
              <p className="text-xs">Peso</p>
            </div>
          </div>
        </section>

        {/* ── Flavor text ── */}
        {flavorText && (
          <section className="mb-4 rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
            <p className="text-sm leading-relaxed text-gray-600 italic dark:text-gray-300">
              "{flavorText}"
            </p>
          </section>
        )}

        {/* ── Fraquezas & Resistências ── */}
        <TypeMatchupsSection types={pokemon.types.map(t => t.type.name)} />

        {/* ── Cadeia evolutiva ── */}
        {hasEvolution && (
          <section className="mb-4 rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
            <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Cadeia Evolutiva
            </h2>
            <div className="flex flex-col gap-3">
              {uniqueEvoPaths!.map((path, i) => (
                <EvolutionRow
                  key={i}
                  path={path}
                  currentName={pokemonId}
                  onNavigate={goToPokemon}
                />
              ))}
            </div>
          </section>
        )}


        {/* ── Formas Especiais ── */}
        {specialForms.length > 0 && (
          <section className="mb-4 rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
            <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Formas Especiais — {game?.name}
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {specialForms.map(f => (
                <SpecialFormCard key={f.name} name={f.name} label={f.label} />
              ))}
            </div>
          </section>
        )}

        {/* ── Status base ── */}
        <section className="mb-4 rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status Base</h2>
          <div className="flex flex-col gap-3">
            {pokemon.stats.map(s => {
              const info = STAT_INFO[s.stat.name] ?? { label: s.stat.name, color: '#aaa' }
              const pct = Math.min(100, (s.base_stat / MAX_STAT) * 100)
              return (
                <div key={s.stat.name} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-right text-[11px] font-semibold text-gray-400">
                    {info.label}
                  </span>
                  <span className="w-8 shrink-0 text-right text-sm font-bold text-gray-700 dark:text-gray-200">
                    {s.base_stat}
                  </span>
                  <div className="flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700" style={{ height: 8 }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: info.color, transition: 'width 0.6s ease' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Movimentos ── */}
        {hasMoves && (
          <section className="mb-4 rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
            {/* Tab bar */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Movimentos — {game?.name}
              </h2>
              <div className="flex rounded-lg bg-gray-100 p-0.5 dark:bg-gray-700">
                {(['level', 'tm'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setMoveTab(tab)}
                    className={[
                      'rounded-md px-2.5 py-1 text-[10px] font-bold transition-all',
                      moveTab === tab
                        ? 'bg-white shadow-sm text-gray-800 dark:bg-gray-600 dark:text-white'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
                    ].join(' ')}
                  >
                    {tab === 'level' ? 'Nível' : 'TM/HM'}
                  </button>
                ))}
              </div>
            </div>

            {activeMoves.length === 0 ? (
              <p className="text-xs text-gray-400">
                Nenhum movimento por {moveTab === 'level' ? 'nível' : 'TM/HM'} neste jogo.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {activeMoves.map(m => (
                  <button
                    key={m.name}
                    onClick={() => setSelectedMove(m.name)}
                    className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-left transition-colors hover:bg-gray-100 active:scale-95 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    {'level' in m && (
                      <span
                        className="w-7 shrink-0 rounded text-center text-[10px] font-bold"
                        style={{ color: (m as { level: number }).level === 0 ? '#aaa' : headerBg }}
                      >
                        {(m as { level: number }).level === 0 ? '—' : (m as { level: number }).level}
                      </span>
                    )}
                    <span className="truncate text-[11px] font-medium capitalize text-gray-700 dark:text-gray-200">
                      {m.name.replace(/-/g, ' ')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Locais de captura ── */}
        <section className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Onde encontrar — {game?.name}
          </h2>
          {gameEncounters.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {gameEncounters.map(e => (
                <div key={e.location}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
                  <span className="capitalize text-[11px] font-medium text-gray-700 dark:text-gray-200">
                    {e.location}
                  </span>
                  {e.minLv > 0 && (
                    <span className="shrink-0 text-[10px] font-bold text-gray-400">
                      Nv.&nbsp;{e.minLv}{e.maxLv > e.minLv ? `–${e.maxLv}` : ''}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              {game?.noEncounterData
                ? 'Dados de localização ainda não disponíveis no PokeAPI para este jogo.'
                : encounters === undefined
                  ? 'Carregando locais...'
                  : 'Não encontrado em área selvagem neste jogo.'}
            </p>
          )}
        </section>

      </main>

      {selectedMove && (
        <MoveSheet moveName={selectedMove} onClose={() => setSelectedMove(null)} />
      )}
    </div>
  )
}
