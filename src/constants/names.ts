/**
 * A PokeAPI usa slugs para os nomes ("mr-mime", "nidoran-f", "type-null").
 * Exibir o slug cru gera nomes estranhos, então normalizamos aqui.
 */
const SPECIAL_NAMES: Record<string, string> = {
  'nidoran-f':  'Nidoran ♀',
  'nidoran-m':  'Nidoran ♂',
  'mr-mime':    'Mr. Mime',
  'mr-rime':    'Mr. Rime',
  'mime-jr':    'Mime Jr.',
  'porygon-z':  'Porygon-Z',
  'ho-oh':      'Ho-Oh',
  'farfetchd':  "Farfetch'd",
  'sirfetchd':  "Sirfetch'd",
  'type-null':  'Type: Null',
  'jangmo-o':   'Jangmo-o',
  'hakamo-o':   'Hakamo-o',
  'kommo-o':    'Kommo-o',
  'flabebe':    'Flabébé',
  'chi-yu':     'Chi-Yu',
  'chien-pao':  'Chien-Pao',
  'ting-lu':    'Ting-Lu',
  'wo-chien':   'Wo-Chien',
}

/** Converte o slug da PokeAPI em nome legível. */
export function displayName(apiName: string | undefined | null): string {
  if (!apiName) return ''
  const key = apiName.toLowerCase()
  if (SPECIAL_NAMES[key]) return SPECIAL_NAMES[key]
  return key
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
