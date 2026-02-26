<template>
  <GenericView
    :headers="ClassIngredients.headers"
    :id-field="'idIngredient'"
    :title="t('dataTable.ingredients.title')"
    :hasActions="true"
    :text-create="t('messages.forms.formIngredient.createIngredient')"
    :text-edit="t('messages.forms.formIngredient.editingIngredient')"
    :icon-create="'mdi-shaker'"
    :icon-edit="'mdi-pencil-outline'"
    :icon-save="'mdi-check'"
    :dialog-model-manager="dialogIngredient"
    :class-model-manager="ingredientModelManager"
    :service-fetch="ingredientsServices.getAllIngredients"
    :service-save="ingredientsServices.saveIngredient"
  >
    <template #form="{ model, updateValid, refForm, submitForm }">
      <IngredientForm
        :ref="refForm"
        :ingredient="model"
        @update:valid="updateValid"
        @submit="submitForm"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
// Componentes
import GenericView from '@/views/view/GenericView.vue'
import IngredientForm from '@/components/forms/products/IngredientForm.vue'

// Models
import { type IIngredient } from '@/classes/models/ModelIProduct'

// Classes
import { ClassIngredients } from '@/classes/products/ClassIngredients'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { ingredientsServices } from '@/services/resources/products/ingredientsService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const classIngredient = new ClassIngredients()
const dialogIngredient = new ClassBaseDialog<IIngredient>({
  persistent: true,
  maxWidth: 800,
})

const ingredientModelManager = {
  model: classIngredient.model,
  reset: () => classIngredient.reset(),
  updateModel: (item: any) => {
    classIngredient.updateModel(item)
  },
}
</script>
