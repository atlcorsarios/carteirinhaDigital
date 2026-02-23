<template>
  <v-col cols="12" md="6">
    <v-number-input
      v-model="recipe.idRecipe"
      :label="label"
      :hint="hint"
      controlVariant="stacked"
      density="compact"
      variant="outlined"
      clearable
      inset
    >
      <template #prepend-inner>
        <v-icon-btn
          icon="mdi-silverware-variant"
          icon-color="info"
          variant="plain"
          @click="handleSearchRecipes"
        />
      </template>

      <template v-if="loading" #append-inner>
        <v-progress-circular
          color="primary"
          indeterminate
        />
      </template>
    </v-number-input>
  </v-col>

  <v-col cols="12" md="6">
    <v-text-field
      :model-value="recipe.description"
      disabled
      density="compact"
      variant="outlined"
    />
  </v-col>

  <DialogSearchRecipes
    v-model:dialog-search-recipe="dialogSearchRecipes"
    @select-item="onRecipeSelected"
  />
</template>

<script setup lang="ts">
// Componentes
import DialogSearchRecipes from '@/components/dialog/searchs/recipes/DialogSearchRecipes.vue';

// Models
import { type IRecipe } from '@/classes/models/ModelIProduct';

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';
import { ClassRecipes } from '@/classes/products/ClassRecipes';

// Vue
import { ref, watch } from 'vue';

const loading = ref<boolean>(false)

const props = defineProps<{
  label?: string
  hint?: string
}>()

const recipe = defineModel<IRecipe>('recipe', { required: true })
const dialogSearchRecipes = new ClassBaseDialog({
  maxWidth: 600
})

function handleSearchRecipes() {
  dialogSearchRecipes.toggleDialog()
}

function onRecipeSelected(selectedItem: IRecipe) {
  recipe.value = selectedItem
}

function clearRecipe() {
  recipe.value = {
    ...ClassRecipes.defaultRecipe()
  }
}

watch(() => recipe.value.idRecipe, (newIdRecipe) => {
  if (!newIdRecipe) {
    clearRecipe()
  }
})
</script>
