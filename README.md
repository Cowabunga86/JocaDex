<div align="center">

# 🎮 JocaDex

**Pokédex PWA feita com amor para o Joca**

Uma Pokédex completa, rápida e offline-first — escolha o jogo, explore os Pokémon e favorite seus preferidos.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-offline--ready-5A0FC8?style=flat-square)

</div>

---

## ✨ Funcionalidades

- **Todos os jogos principais** — Geração 1 a 9, incluindo remakes (FireRed, HGSS, ORAS, BDSP…)
- **Busca por nome ou número** dentro de cada Pokédex
- **Filtro por tipo** com suporte a múltiplos tipos simultâneos (ex: Fogo + Voador)
- **Ordenação** por número (#) ou nome (A-Z)
- **Favoritos globais** — favorite em qualquer jogo e veja todos num só lugar
- **Ficha completa** com stats, movimentos (Level-up e MT/MO), fraquezas & resistências e cadeia evolutiva
- **Navegação prev/next** entre Pokémon dentro do jogo
- **Dark mode** automático (segue o sistema)
- **PWA com cache offline** — funciona sem internet após o primeiro acesso
- **Layout mobile-first** — feito para usar no celular

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Estilo | Tailwind CSS v4 |
| Roteamento | React Router v7 |
| Dados remotos | TanStack Query v5 |
| API | [PokéAPI v2](https://pokeapi.co/) (REST, sem backend) |
| PWA | vite-plugin-pwa + Workbox |
| Ícones | Lucide React |

---

## 🚀 Rodando localmente

```bash
# Clone o repositório
git clone https://github.com/Cowabunga86/JocaDex.git
cd JocaDex

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

```bash
# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## 📁 Estrutura do projeto

```
src/
├── api/           # Funções de fetch da PokéAPI
├── constants/     # Jogos, cores de tipo e tabela de efetividade
├── hooks/         # TanStack Query hooks + useFavorites
├── pages/         # HomePage, PokemonListPage, PokemonDetailPage, FavoritesPage
└── types/         # Tipagens da PokéAPI
```

---

## 📄 Licença

MIT — feito com ❤️ para o Joca.
