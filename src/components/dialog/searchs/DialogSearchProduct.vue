<template>
  <GenericSearchDialog
    :title="t('dialogSearch.searchProduct.title')"
    :storage-context="'search_products'"
    :headers="ClassProducts.headers"
    :filters="ClassProducts.filters"
    :default-filter="ClassProducts.defaultFilterConfig"
    :service-fetch="productsServices.getAllProducts"
    :dialog-search-model="dialogSearchModel"
    @select-item="(item) => $emit('select-item', item)"
  />
</template>

<script setup lang="ts">
// Componentes
import GenericSearchDialog from './GenericSearchDialog.vue'

// Models
import type { IProduct } from '@/classes/models/ModelIProduct'

// Classes
import { ClassProducts } from '@/classes/ClassProducts'
import type { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { productsServices } from '@/services/resources/products/productsService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialogSearchModel = defineModel<ClassBaseDialog>('dialog-search-product', { required: true })
const emit = defineEmits<{
  (e: 'select-item', item: IProduct): void
}>()
</script>
