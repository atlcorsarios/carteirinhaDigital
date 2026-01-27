<template>
  <GenericView
    :headers="ClassProducts.headers"
    :id-field="'idProduct'"
    :title="t('dataTable.products.title')"
    :hasActions="true"
    :hasMoreDetails="true"
    :text-create="t('messages.forms.formProduct.createProduct')"
    :text-edit="t('messages.forms.formProduct.editingProduct')"
    :icon-create="'mdi-package-variant-closed-plus'"
    :icon-edit="'mdi-pencil-outline'"
    :icon-save="'mdi-package-variant-closed-check'"
    :dialog-model-manager="dialogProduct"
    :class-model-manager="productModelManager"
    :service-fetch="productsServices.getAllProducts"
    :service-save="productsServices.saveProduct"
  >
    <template #form="{ model, updateValid }">
      <ProductForm :product="model" @update:valid="updateValid" />
    </template>

    <template #moreDetails="{ item }">
      <ProductsMoreDetails :product="item" />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
// Componentes
import GenericView from '@/views/view/GenericView.vue'
import ProductForm from '@/components/forms/products/ProductForm.vue'
import ProductsMoreDetails from './ProductsMoreDetails.vue'

// Models
import { type IProduct } from '@/classes/models/ModelIProduct'

// Classes
import { ClassProducts } from '@/classes/products/ClassProducts'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { productsServices } from '@/services/resources/products/productsService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const classProduct = new ClassProducts()
const dialogProduct = new ClassBaseDialog<IProduct>({
  persistent: true,
  maxWidth: 800,
})

const productModelManager = {
  model: classProduct.model,
  reset: () => classProduct.reset(),
  updateModel: (item: any) => {
    classProduct.updateModel(item)
  },
}
</script>
