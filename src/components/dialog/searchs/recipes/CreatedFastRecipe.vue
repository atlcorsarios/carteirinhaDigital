<template>
  <GenericCreateQuickly
    :title="t('messages.forms.formRecipe.createRecipe')"
    :icon="'mdi-cookie-plus'"
    :save-icon="'mdi-cookie-check'"
    :dialog-model="dialogModel"
    :class-manager="recipeManager"
    :service-save="recipesServices.saveRecipe"
    @created-fast-item="(item) => $emit('created-fast-item', item)"
  >
    <template #form="{ model, updateValid, refForm, submitForm }">
      <RecipeForm
        :ref="refForm"
        :recipe="model"
        @update:recipe="(val) => Object.assign(model, val)"
        @update:valid="updateValid"
        @submit="submitForm"
        :create-fast="true"
      />
    </template>
  </GenericCreateQuickly>
</template>

<script setup lang="ts">
// Componentes
import GenericCreateQuickly from '../GenericCreateQuickly.vue'
import RecipeForm from '@/components/forms/products/RecipeForm.vue'

// Classes
import { ClassRecipes } from '@/classes/products/ClassRecipes'

// Services
import { recipesServices } from '@/services/resources/products/recipesService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialogModel = defineModel<any>('dialog-create-quickly', { required: true })
defineEmits(['created-fast-item'])

const classRecipe = new ClassRecipes()
const recipeManager = {
  model: classRecipe.model,
  reset: () => classRecipe.reset(),
}

</script>
