import { useQuotationStore } from '@/stores/quotationStore'
import { BASE_CURRENCY, getCurrency } from '@/locales/definitionsLocales'
import { i18n } from '@/plugins/i18n'

export class ClassFormatters {
  static formatBoolean(value: boolean, filterLabelKey?: string): string {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return value ? t(filterLabelKey ?? 'messages.yes') : t(filterLabelKey ?? 'messages.no')
  }

  static formatPriceDynamic(valueInBase: number): string {
    if (valueInBase === undefined || valueInBase === null) return '-'

    const currentLocale = i18n.global.locale.value as string
    const targetCurrency = getCurrency(currentLocale)
    const store = useQuotationStore()
    const convertedValue = store.convertFromBaseTo(valueInBase, targetCurrency)

    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: targetCurrency,
    }).format(convertedValue)
  }

  static prepareForSave<T extends Record<string, any>>(item: T, keys: keyof T | (keyof T)[]): T {
    const currentLocale = i18n.global.locale.value as string
    const currentCurrency = getCurrency(currentLocale)

    if (currentCurrency === BASE_CURRENCY) {
      return item
    }

    const store = useQuotationStore()
    const itemToSend = { ...item } as T
    const fieldsToConvert = Array.isArray(keys) ? keys : [keys]

    fieldsToConvert.forEach((key: keyof T) => {
      const value = itemToSend[key]
      if (typeof value === 'number') {
        const converted = store.convertToBaseFrom(value, currentCurrency)
        itemToSend[key] = converted as any
      }
    })
    return itemToSend
  }
}
