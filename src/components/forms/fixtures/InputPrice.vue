<template>
  <v-mask-input
    v-model="model"
    :rules="rules"
    :label="t(label)"
    :options="currencyOptions"
    :hint="convertedHint"
    :placeholder="currencyPlaceholder"
    density="compact"
    variant="outlined"
    clearable
    type="number"
  >
    <template #prepend-inner>
      <span class="text-caption font-weight-bold text-medium-emphasis mr-1 mt-1">
        {{ coinCode }}
      </span>
      <v-divider vertical class="mx-2 my-1" />
    </template>
  </v-mask-input>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BASE_CURRENCY, getCurrency } from '@/locales/definitionsLocales'
import { useQuotationStore } from '@/stores/quotationStore'

const model = defineModel<number | null | undefined>({ required: true })

interface Props {
  label?: string
  hint?: string
  rules?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  label: 'forms.formProduct.price.label',
  hint: 'forms.formProduct.price.hint',
  rules: () => []
})

const { t, locale } = useI18n()
const quotationStore = useQuotationStore()

const coinCode = computed(() => getCurrency(locale.value))

const currencyPlaceholder = computed(() => {
  return new Intl.NumberFormat(locale.value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(0)
})

const currencyOptions = computed(() => {
  const parts = new Intl.NumberFormat(locale.value).formatToParts(1000.1)
  return {
    decimal: parts.find((p) => p.type === 'decimal')?.value,
    separator: parts.find((p) => p.type === 'group')?.value,
    prefix: '',
    precision: 2,
  }
})

const convertedHint = computed(() => {
  const value = model.value
  if (!value || !coinCode.value) return ''

  const currentCurrency = coinCode.value
  let convertedValue = 0

  if (currentCurrency != BASE_CURRENCY) {
    convertedValue = quotationStore.convertToBaseFrom(value, currentCurrency)
  } else {
    convertedValue = value
  }

  const formatted = new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: BASE_CURRENCY,
  }).format(convertedValue)

  return `${t(props.hint)} ${formatted} ${BASE_CURRENCY}`
})
</script>
