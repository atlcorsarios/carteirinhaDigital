<template>
  <RouterView />
</template>

<script setup lang="ts">
import { getCurrency } from '@/locales/definitionsLocales'
import { useQuotationStore } from '@/stores/quotationStore'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const { locale } = useI18n()
const quotationStore = useQuotationStore()

onMounted(() => {
  const currentCurrency = getCurrency(locale.value)
  quotationStore.ensureRateFor(currentCurrency)
})

</script>
