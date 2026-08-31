import { useNavigate } from 'react-router'
import { Heart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { GEN_LABELS, GAMES, spriteUrl, type GameInfo } from '../constants/games'
import { useVersionGroups } from '../hooks/usePokeAPI'

function GameCard({ game }: { game: GameInfo }) {
  const navigate = useNavigate()
  const hasTwo = game.coverPokemon.length >= 2
  const bg = game.color2
    ? `linear-gradient(135deg, ${game.color} 0%, ${game.color2} 100%)`
    : game.color

  return (
    <button
      onClick={() => navigate(`/game/${game.slug}`)}
      className="group relative flex items-center overflow-hidden rounded-2xl px-4 py-3 text-left transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
      style={{ background: bg, color: game.textColor, minHeight: '4.5rem' }}
    >
      {/* Texto */}
      <div className="z-10 flex-1 pr-2">
        <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">
          Gen {game.generation}
        </span>
        <span className="block text-sm font-bold leading-tight">{game.name}</span>
      </div>

      {/* Sprites de capa */}
      <div className={`relative flex shrink-0 items-end ${hasTwo ? '-space-x-3' : ''}`}>
        {game.coverPokemon.map((id, i) => (
          <img
            key={id}
            src={spriteUrl(id)}
            alt=""
            width={hasTwo ? 52 : 62}
            height={hasTwo ? 52 : 62}
            className="drop-shadow-md"
            style={{
              imageRendering: 'pixelated',
              zIndex: i,
              // segundo sprite levemente sobreposto e mais baixo para profundidade
              transform: hasTwo && i === 1 ? 'translateY(4px)' : undefined,
            }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ))}
      </div>
    </button>
  )
}

export function HomePage() {
  const { data, isLoading } = useVersionGroups()
  const { favorites } = useFavorites()

  const availableSlugs = new Set(data?.results.map(r => r.name) ?? [])
  const games = GAMES.filter(g => availableSlugs.size === 0 || availableSlugs.has(g.slug))

  const byGen = games.reduce<Record<number, GameInfo[]>>((acc, g) => {
    ;(acc[g.generation] ??= []).push(g)
    return acc
  }, {})

  return (
    <div className="page-enter min-h-svh bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-[#CC0000] px-4 py-3 shadow-md">
        <h1 className="font-pixel text-base leading-none text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          <span className="text-[#FFCB05]">JOCA</span>DEX
        </h1>
        <span className="text-xs font-medium text-red-200">Escolha um jogo</span>
        <button
          onClick={() => navigate('/favorites')}
          className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/30"
        >
          <Heart size={13} className="fill-white text-white" />
          Favoritos{favorites.length > 0 && ` (${favorites.length})`}
        </button>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-8 pt-6">
        {isLoading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="mb-3 h-3 w-36 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2].map(j => (
                    <div key={j} className="h-[72px] rounded-2xl bg-gray-200 dark:bg-gray-700" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(byGen)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([gen, genGames]) => (
                <section key={gen}>
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {GEN_LABELS[Number(gen)] ?? `Geração ${gen}`}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {genGames.map(game => (
                      <GameCard key={game.slug} game={game} />
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </main>
    </div>
  )
}
