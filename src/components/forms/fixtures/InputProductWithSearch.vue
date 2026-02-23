<template>
  <v-col cols="12">
    <v-number-input
      v-model="product.idProduct"
      :label="label"
      :hint="hint"
      controlVariant="stacked"
      density="compact"
      variant="outlined"
      clearable
      inset
    >
      <template #prepend-inner>
        <v-icon-btn
          icon="mdi-tag-search"
          icon-color="info"
          variant="plain"
          @click="handleSearchProduct"
        />
      </template>

      <template v-if="loading" #append-inner>
        <v-progress-circular color="primary" indeterminate />
      </template>
    </v-number-input>
  </v-col>

  <v-col cols="12">
    <v-text-field
      :model-value="product.description"
      disabled
      density="compact"
      variant="outlined"
    />
  </v-col>

  <DialogSearchProduct
    v-model:dialog-search-product="dialogSearchProduct"
    @select-item="onProductSelected"
  />
</template>

<script setup lang="ts">
import DialogSearchProduct from '@/components/dialog/searchs/DialogSearchProduct.vue';
import type { IProduct } from '@/classes/models/ModelIProduct';
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassProducts } from '@/classes/products/ClassProducts';
import { ref, watch } from 'vue'

const loading = ref<boolean>(false)

const props = defineProps<{
  label?: string
  hint?: string
}>()

const product = defineModel<any>('product', { required: true })
const dialogSearchProduct = new ClassBaseDialog({
  maxWidth: 600,
})

function handleSearchProduct() {
  dialogSearchProduct.toggleDialog()
}

function onProductSelected(selectedItem: IProduct) {
  product.value = selectedItem
}

function clearProduct() {
  product.value = {
    ...ClassProducts.defaultProduct()
  }
}

watch(
  () => product.value.idProduct,
  (newIdProduct) => {
    if (!newIdProduct) {
      clearProduct()
    }
  },
)

</script>
