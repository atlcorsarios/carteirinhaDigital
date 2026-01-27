<template>
  <GenericView
    :headers="ClassRecipes.headers"
    :id-field="'idRecipe'"
    :title="t('dataTable.recipes.title')"
    :hasActions="true"
    :text-create="t('messages.forms.formRecipe.createRecipe')"
    :text-edit="t('messages.forms.formRecipe.editingRecipe')"
    :icon-create="'mdi-silverware-variant'"
    :icon-edit="'mdi-pencil-outline'"
    :icon-save="'mdi-check'"
    :dialog-model-manager="dialogRecipe"
    :class-model-manager="recipeModelManager"
    :service-fetch="recipesServices.getAllRecipes"
    :service-save="recipesServices.saveRecipe"
  >
    <template #form="{ model, updateValid }">
      <RecipeForm
        :recipe="model"
        @update:valid="updateValid"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
// Componentes
import GenericView from '@/views/view/GenericView.vue'
import RecipeForm from '@/components/forms/products/RecipeForm.vue'

// Models
import { type IRecipe } from '@/classes/models/ModelIProduct'

// Classes
import { ClassRecipes } from '@/classes/products/ClassRecipes'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { recipesServices } from '@/services/resources/products/recipesService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const classRecipe = new ClassRecipes()
const dialogRecipe = new ClassBaseDialog<IRecipe>({
  persistent: true,
  maxWidth: 800,
})

const recipeModelManager = {
  model: classRecipe.model,
  reset: () => classRecipe.reset(),
  updateModel: (item: any) => {
    classRecipe.updateModel(item)
  },
}
</script>
