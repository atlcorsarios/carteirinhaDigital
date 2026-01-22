<template>

</template>

<script setup lang="ts">
import { useQuotationStore } from '@/stores/quotationStore'
import { onMounted } from 'vue'

const quotationStore = useQuotationStore()

onMounted(() => {
  quotationStore.ensureRateFor("")
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
