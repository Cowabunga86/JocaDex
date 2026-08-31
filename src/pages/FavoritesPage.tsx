import { ArrowLeft, Heart } from 'lucide-react'
import { useNavigate } from 'react-router'
import { TYPE_COLORS, TYPE_NAMES_PT } from '../constants/typeColors'
import { usePokemon } from '../hooks/usePokeAPI'
import { useFavorites } from '../hooks/useFavorites'
import { displayName } from '../constants/names'

function FavoriteCard({ name }: { name: string }) {
  const navigate = useNavigate()
  const { data: pokemon } = usePokemon(name)
  const { toggle } = useFavorites()

  // A URL de sprite espera ID numérico — passar o nome dava imagem quebrada.
  // Sem o dado carregado, mostramos um placeholder.
  const spriteUrl = pokemon?.sprites.front_default ?? null
  const types = pokemon?.types ?? []
  const id = pokemon?.id

  return (
    <div className="relative flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-all dark:bg-gray-800/60">
      <button
        onClick={() => navigate(`/favorites/pokemon/${name}`)}
        className="flex flex-1 items-center gap-3 text-left"
      >
        {spriteUrl ? (
          <img
            src={spriteUrl}
            alt={displayName(name)}
            width={56}
            height={56}
            className="shrink-0 drop-shadow-sm"
            style={{ imageRendering: 'pixelated' }}
            loading="lazy"
          />
        ) : (
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            {id && (
              <span className="text-xs font-bold text-gray-400">
                #{String(id).padStart(3, '0')}
              </span>
            )}
            <span className="truncate font-semibold text-gray-900 dark:text-white">
              {displayName(name)}
            </span>
          </div>
          <div className="mt-1 flex gap-1 flex-wrap">
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

      <button
        onClick={() => toggle(name)}
        className="shrink-0 rounded-full p-1.5 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-90"
        title="Remover dos favoritos"
      >
        <Heart size={16} className="fill-red-400 text-red-400" />
      </button>
    </div>
  )
}

export function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites } = useFavorites()

  return (
    <div className="page-enter min-h-svh bg-white dark:bg-gray-950">
      <header
        className="sticky top-0 z-10 px-4 pb-3 pt-3 shadow-md"
        style={{ backgroundColor: '#CC0000' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="shrink-0 rounded-full p-1 text-white/80 hover:bg-white/20"
          >
            <ArrowLeft size={20} />
          </button>
          <h1
            className="flex-1 text-[11px] font-black leading-none text-white"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            Favoritos
          </h1>
          <span className="text-xs text-white/70">
            {favorites.length} Pokémon
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4">
        {favorites.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-5xl">💔</p>
            <p className="mt-4 font-semibold text-gray-500 dark:text-gray-400">
              Nenhum favorito ainda.
            </p>
            <p className="mt-1 text-sm">
              Toque no ♥ em qualquer Pokémon para favoritar.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white"
            >
              Escolher um jogo
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {favorites.map(name => (
              <FavoriteCard key={name} name={name} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
