import { createBrowserRouter, RouterProvider } from 'react-router'
import { HomePage } from './pages/HomePage'
import { PokemonDetailPage } from './pages/PokemonDetailPage'
import { PokemonListPage } from './pages/PokemonListPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/game/:gameId', element: <PokemonListPage /> },
  { path: '/game/:gameId/pokemon/:pokemonId', element: <PokemonDetailPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
