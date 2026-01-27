<template>
  <GenericSearchDialog
    :title="t('dialogSearch.searchIngredient.title')"
    :storage-context="'search_ingredients'"
    :headers="ClassIngredients.headers"
    :filters="ClassIngredients.filters"
    :default-filter="ClassIngredients.defaultFilterConfig"
    :service-fetch="ingredientsServices.getAllIngredients"
    :dialog-search-model="dialogSearchModel"
    :select-items="true"
    v-model:selectedItens="selectedItens"
  >
    <template #action-btn="{ openCreate }">
      <BtnOpenDialog
        v-tooltip="t('tooltips.forms.create')"
        icon="mdi-check"
        variant="text"
        color="success"
        @click="dialogSearchModel.toggleDialog()"
      />

      <v-spacer />

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
import type { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { ingredientsServices } from '@/services/resources/products/ingredientsService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const selectedItens = defineModel<IIngredient[]>('selectedItens', { required: true })
const dialogSearchModel = defineModel<ClassBaseDialog<any>>('dialog-search-ingredient', {
  required: true,
})

</script>
