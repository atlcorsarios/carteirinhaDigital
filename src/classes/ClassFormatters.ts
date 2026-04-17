import { useQuotationStore } from '@/stores/quotationStore'
import { BASE_CURRENCY, getCurrency } from '@/locales/definitionsLocales'
import { i18n } from '@/plugins/i18n'
import { ROLE_TRANSLATIONS, validRoles, type TRole } from './models/resources/ModelUsuarios'

export class ClassFormatters {
  static formatBoolean(value: boolean, filterLabelKey?: string): string {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return value ? t(filterLabelKey ?? 'messages.yes') : t(filterLabelKey ?? 'messages.no')
  }

  static formatDate(date: Date | string | number | undefined | null): string {
    if (!date) return ''

    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    const locale = i18n.global.locale.value || 'pt'

    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d)
  }

  static formatDateTime(date: Date | string | number | undefined | null): string {
    if (!date) return ''
    const locale = i18n.global.locale.value || 'pt'
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  static formatTime(seconds: number): string {
    const minutesMath = Math.floor(seconds / 60)
    const secondsMath = seconds % 60
    return `${minutesMath}:${secondsMath.toString().padStart(2, '0')}`
  }

  static formatPercent(value: number): string {
    return `${value} %`
  }

  static formatRolesTranslate(role: TRole): string {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return t(ROLE_TRANSLATIONS[role])
  }

  static formatI18n(i18nKey: string = '', attribute?: string): string {
    return attribute ? i18n.global.t(`${i18nKey}.${attribute}`) : ''
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

  static sortNumeric(a: any, b: any): number {
    const parse = (val: any) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;

      const cleanStr = String(val)
        .replace(/\./g, '')
        .replace(',', '.')
        .replace(/[^0-9.-]+/g, '');

      return Number(cleanStr) || 0;
    };

    return parse(a) - parse(b);
  }

  static formatOptionsRoles(): { title: string, value: TRole }[] {
    return validRoles.map((role) => ({
      title: i18n.global.t(ROLE_TRANSLATIONS[role]),
      value: role,
    }))
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
