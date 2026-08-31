# JocaDex

Pokédex feita para o Joca — escolha o jogo, explore os Pokémon daquela geração e favorite os que quiser. Funciona no celular, instala como app e roda sem internet após o primeiro acesso.

Não tem backend. Tudo vem da [PokéAPI](https://pokeapi.co/), é cacheado pelo navegador e fica disponível offline via Service Worker. Abrir e sair para o jogo e voltar mais tarde funciona sem precisar de conexão.

## Por que existe

As Pokédex online são pesadas, cheias de anúncio e abertas no computador — difíceis de usar enquanto você joga no Nintendo Switch ou num portátil. Esta é pequena, mobile-first, abre instantaneamente e só mostra os Pokémon do jogo que você escolheu, na ordem certa, com os tipos certos daquela versão.

## Como usar

Escolha um jogo na tela inicial. A lista mostra todos os Pokémon disponíveis naquele jogo, na ordem da Pokédex regional. Toque em qualquer um para ver a ficha completa: stats, movimentos por nível e MT, cadeia evolutiva e fraquezas/resistências.

Para filtrar por tipo, toque em um ou mais tipos no topo da lista — o filtro funciona em modo AND: selecionar Fogo e Voador mostra só os que têm os dois tipos ao mesmo tempo. Para favoritar, toque no ♥ na ficha ou na listagem. Os favoritos ficam salvos entre sessões e aparecem todos juntos no botão **Favoritos** na tela inicial, independente do jogo em que foram marcados.

A busca aceita nome ou número. A ordenação alterna entre número (#) e nome (A-Z).

## Instalação local

```bash
git clone https://github.com/Cowabunga86/JocaDex.git
cd JocaDex
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

```bash
# Build de produção
npm run build
npm run preview
```

## Recursos

- Todos os jogos principais — Geração 1 a 9, incluindo FireRed/LeafGreen, HGSS, ORAS, BDSP e Scarlet/Violet
- Filtro multi-tipo com lógica AND — filtre por dois ou mais tipos ao mesmo tempo
- Favoritos globais — favoritados em qualquer jogo, consultados num lugar só
- Ficha completa — stats base, movimentos por nível e MT/MO, cadeia evolutiva, fraquezas e resistências calculadas pela tabela de tipos
- Navegação prev/next dentro do jogo, com contexto preservado (volta ao jogo ou à lista de favoritos conforme a origem)
- Dark mode automático — segue a preferência do sistema
- PWA instalável — aparece na tela inicial do celular como qualquer outro app
- Cache offline via Workbox — funciona sem internet após o primeiro acesso

## Estrutura do projeto

| Pasta / arquivo | Função |
|---|---|
| `src/api/` | Funções de fetch da PokéAPI |
| `src/constants/` | Lista de jogos, cores por tipo e tabela de efetividade |
| `src/hooks/` | Hooks TanStack Query e `useFavorites` (estado global com localStorage) |
| `src/pages/` | `HomePage`, `PokemonListPage`, `PokemonDetailPage`, `FavoritesPage` |
| `src/types/` | Tipagens da resposta da PokéAPI |
| `vite.config.ts` | Configuração do Vite e do plugin PWA |

## Notas técnicas

Os dados de cada Pokémon são buscados individualmente da PokéAPI e cacheados pelo TanStack Query durante a sessão. O cache offline do Service Worker (Workbox) armazena as requisições feitas, então Pokémon que você já visualizou ficam disponíveis sem conexão — os que ainda não foram visitados precisam de internet na primeira vez.

Os favoritos são salvos por nome no `localStorage`, sem vínculo com nenhum jogo específico. A página de favoritos busca os dados de cada Pokémon favoritado separadamente, o que significa que ela também se beneficia do cache offline para os itens já visitados.

O filtro de tipos usa a lista de tipos da versão do jogo retornada pela PokéAPI — em jogos anteriores à introdução de um tipo (como Aço e Sombrio na Geração 2), esses tipos simplesmente não aparecem no filtro.

## Licença

MIT.

## Marcas

Pokémon, Pokédex e todos os nomes de Pokémon são marcas registradas da Nintendo, Game Freak e Creatures Inc. Os dados exibidos são obtidos da [PokéAPI](https://pokeapi.co/), uma API de terceiros não oficial. Este projeto é independente, de uso pessoal, sem fins comerciais e sem vínculo, patrocínio ou aprovação da Nintendo, Game Freak ou Creatures Inc.
