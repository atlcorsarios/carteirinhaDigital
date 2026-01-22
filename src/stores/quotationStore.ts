import { useSnackbar } from '@/composables/useSnackbar'
import { BASE_CURRENCY } from '@/locales/definitionsLocales'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

export const useQuotationStore = defineStore('quotation', () => {
  const rates = ref<Record<string, number>>({
    [BASE_CURRENCY]: 1,
  })

  const { t } = useI18n()
  const { notify } = useSnackbar()
  const loading = ref(false)

  async function ensureRateFor(targetCurrency: string) {
    if (targetCurrency === BASE_CURRENCY || rates.value[targetCurrency]) return

    if (loading.value) return
    loading.value = true

    try {
      const pair = `${targetCurrency}-${BASE_CURRENCY}`
      const { data } = await axios.get(`https://economia.awesomeapi.com.br/last/${pair}`)
      const apiResponseKey = pair.replace('-', '')

      if (data[apiResponseKey]) {
        rates.value[targetCurrency] = parseFloat(data[apiResponseKey].bid)
      }
    } catch (e) {
      notify(`${t('messages.errors.searchQuote')} ${targetCurrency}`, 'error')
      console.error(`${t('messages.errors.searchQuote')} ${targetCurrency}`, e)
    } finally {
      loading.value = false
    }
  }

  function convertFromBaseTo(valueInBase: number, targetCurrency: string): number {
    const rate = rates.value[targetCurrency]
    if (!rate) return valueInBase
    return valueInBase / rate
  }

  function convertToBaseFrom(valueInForeign: number, sourceCurrency: string): number {
    const rate = rates.value[sourceCurrency]
    if (!rate) return valueInForeign
    return valueInForeign * rate
  }

  return {
    rates,
    ensureRateFor,
    convertFromBaseTo,
    convertToBaseFrom
  }
})
