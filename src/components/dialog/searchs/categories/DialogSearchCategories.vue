<template>
  <GenericSearchDialog
    :title="t('dialogSearch.searchCategory.title')"
    :storage-context="'search_categories'"
    :headers="ClassCategories.headers"
    :filters="ClassCategories.filters"
    :default-filter="ClassCategories.defaultFilterConfig"
    :service-fetch="categoriesServices.getAllCategories"
    :dialog-search-model="dialogSearchModel"
    @select-item="(item) => $emit('select-item', item)"
  >
    <template #action-btn="{ openCreate }">
      <BtnOpenDialog
        v-tooltip="t('tooltips.forms.create')"
        icon="mdi-tag-plus"
        @click="openCreate"
      />
    </template>

    <template #create-quickly="{ dialogModel, onCreated }">
      <CreatedFastCategory
        :dialog-create-quickly="dialogModel"
        @created-fast-item="onCreated"
      />
    </template>
  </GenericSearchDialog>
</template>

<script setup lang="ts">
// Componentes
import GenericSearchDialog from '../GenericSearchDialog.vue'
import BtnOpenDialog from '../../BtnOpenDialog.vue'
import CreatedFastCategory from './CreatedFastCategory.vue'

// Models
import { type ICategory } from '@/classes/models/ModelIProduct'

// Classes
import { ClassCategories } from '@/classes/products/ClassCategories'
import type { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { categoriesServices } from '@/services/resources/products/categoriesService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialogSearchModel = defineModel<ClassBaseDialog>('dialog-search-category', { required: true })
const emit = defineEmits<{
  (e: 'select-item', item: ICategory): void
}>()

</script>
