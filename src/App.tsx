import { createBrowserRouter, RouterProvider } from 'react-router'
import { HomePage } from './pages/HomePage'
import { FavoritesPage } from './pages/FavoritesPage'
import { PokemonDetailPage } from './pages/PokemonDetailPage'
import { PokemonListPage } from './pages/PokemonListPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/favorites', element: <FavoritesPage /> },
  { path: '/favorites/pokemon/:pokemonId', element: <PokemonDetailPage /> },
  { path: '/game/:gameId', element: <PokemonListPage /> },
  { path: '/game/:gameId/pokemon/:pokemonId', element: <PokemonDetailPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
