export const FALLBACK_LOCALE = 'pt-BR'

export const availableLocales = [
  { title: 'Português (BR)', value: 'pt-BR' },
  { title: 'English (US)', value: 'en-US' },
  { title: 'Español (ES)', value: 'es-ES' },
]

export const CURRENCY_MAP: Record<string, string> = {
  'pt-BR': 'BRL',
  'en-US': 'USD',
  'es-ES': 'EUR',
}

export const BASE_CURRENCY = CURRENCY_MAP[FALLBACK_LOCALE] || 'BRL'

export function getCurrency(locale: string): string {
  return CURRENCY_MAP[locale] || BASE_CURRENCY
}
