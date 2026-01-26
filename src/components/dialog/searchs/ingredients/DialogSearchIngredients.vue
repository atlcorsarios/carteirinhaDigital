<template>
  <GenericSearchDialog
    :title="t('dialogSearch.searchIngredient.title')"
    :storage-context="'search_ingredients'"
    :headers="ClassIngredients.headers"
    :filters="ClassIngredients.filters"
    :default-filter="ClassIngredients.defaultFilterConfig"
    :service-fetch="ingredientsServices.getAllIngredients"
    :dialog-search-model="dialogSearchModel"
    v-model:selected-items="selectedItems"
    :select-items="true"
  >
    <template #action-btn="{ openCreate }">
      <BtnOpenDialog
        v-tooltip="t('tooltips.forms.create')"
        icon="mdi-cookie-plus"
        @click="openCreate"
      />
    </template>

    <template #create-quickly="{ dialogModel, onCreated }">
      <CreatedFastIngredient
        :dialog-create-quickly="dialogModel"
        @update:dialog-create-quickly="(val) => Object.assign(dialogModel, val)"
        @created-fast-item="onCreated"
      />
    </template>
  </GenericSearchDialog>
</template>

<script setup lang="ts">
// Componentes
import GenericSearchDialog from '../GenericSearchDialog.vue'
import BtnOpenDialog from '../../BtnOpenDialog.vue'
import CreatedFastIngredient from './CreatedFastIngredient.vue'

// Models
import { type IIngredient } from '@/classes/models/ModelIProduct'

// Classes
import { ClassIngredients } from '@/classes/products/ClassIngredients'

// Services
import { ingredientsServices } from '@/services/resources/products/ingredientsService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialogSearchModel = defineModel<any>('dialog-search-ingredient', { required: true })
const selectedItems = defineModel<IIngredient[]>('items-selected', { required: true })

</script>
