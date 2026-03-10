<template>
  <GenericCreateQuickly
    :title="t('messages.forms.formIngredient.createIngredient')"
    :icon="'mdi-cookie-plus'"
    :save-icon="'mdi-cookie-check'"
    :dialog-model="dialogModel"
    :class-manager="recipeManager"
    :service-save="ingredientsServices.saveIngredient"
    @created-fast-item="(item) => $emit('created-fast-item', item)"
  >
    <template #form="{ model, updateValid, refForm, submitForm }">
      <IngredientForm
        :ref="refForm"
        :ingredient="model"
        @update:ingredient="(val) => Object.assign(model, val)"
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
import IngredientForm from '@/components/forms/products/IngredientForm.vue'

// Classes
import { ClassIngredients } from '@/classes/products/ClassIngredients'

// Services
import { ingredientsServices } from '@/services/resources/products/ingredientsService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialogModel = defineModel<any>('dialog-create-quickly', { required: true })
defineEmits(['created-fast-item'])

const classIngredients = new ClassIngredients()
const recipeManager = {
  model: classIngredients.model,
  reset: () => classIngredients.reset(),
}

</script>
