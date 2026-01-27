<template>
  <GenericSearchDialog
    :title="t('dialogSearch.searchRecipe.title')"
    :storage-context="'search_recipes'"
    :headers="ClassRecipes.headers"
    :filters="ClassRecipes.filters"
    :default-filter="ClassRecipes.defaultFilterConfig"
    :service-fetch="recipesServices.getAllRecipes"
    :dialog-search-model="dialogSearchModel"
    @select-item="(item) => $emit('select-item', item)"
  >
    <template #action-btn="{ openCreate }">
      <BtnOpenDialog
        v-tooltip="t('tooltips.forms.create')"
        icon="mdi-cookie-plus"
        @click="openCreate"
      />
    </template>

    <template #create-quickly="{ dialogModel, onCreated }">
      <CreatedFastRecipe
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
import CreatedFastRecipe from './CreatedFastRecipe.vue'

// Models
import { type IRecipe } from '@/classes/models/ModelIProduct'

// Classes
import { ClassRecipes } from '@/classes/products/ClassRecipes'
import type { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { recipesServices } from '@/services/resources/products/recipesService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialogSearchModel = defineModel<ClassBaseDialog>('dialog-search-recipe', { required: true })
const emit = defineEmits<{
  (e: 'select-item', item: IRecipe): void
}>()

</script>
