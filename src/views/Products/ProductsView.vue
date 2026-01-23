<template>

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

// async function saveProduct() {
//   // 1. Pega o modelo do formulário (que pode estar em USD se o locale for en-US)
//   const productForm = formManager.model

//   // 2. Prepara para envio (Converte 'price' e 'cost' de volta para BRL)
//   const payload = ClassFormatters.prepareForSave(productForm, ['price', 'cost'])

//   // 3. Envia para a API (O backend sempre recebe BRL)
//   await productsService.save(payload)
// }
</script>
