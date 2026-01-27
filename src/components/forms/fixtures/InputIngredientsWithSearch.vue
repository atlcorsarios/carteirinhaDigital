<template>
  <v-row dense>
    <v-col cols="12">
      <v-select
        v-model="selectedItems"
        item-title="description"
        item-value="idIngredient"
        :items="selectedItems"
        :label="t('forms.formIngredientsInRecipe.ingredients.label')"
        :hint="t('forms.formIngredientsInRecipe.ingredients.hint')"
        density="compact"
        variant="outlined"
        chips
        multiple
        return-object
        clearable
        @click:clear="ingredients = []"
      >
        <template #prepend-inner>
          <v-icon-btn
            icon="mdi-shaker"
            icon-color="info"
            variant="plain"
            @click="handleSearchIngredients"
          />
        </template>
      </v-select>
    </v-col>

    <v-col
      v-if="ingredients.length > 0"
      v-for="(item, index) in ingredients"
      :key="item.ingredient?.idIngredient ?? index"
      cols="12"
    >
      <v-text-field
        v-model.number="item.amount"
        :suffix="item.ingredient?.measurement"
        :label="item.ingredient?.description"
        type="number"
        min="0"
        density="compact"
        variant="outlined"
      />
    </v-col>
  </v-row>

  <DialogSearchIngredients
    v-model:dialog-search-ingredient="dialogSearchIngredients"
    v-model:items-selected="selectedItems"
  />
</template>

<script setup lang="ts">
// Componentes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';
import DialogSearchIngredients from '@/components/dialog/searchs/ingredients/DialogSearchIngredients.vue';

// Models
import { type IIngredient, type IIngredientsInRecipe } from '@/classes/models/ModelIProduct';

// Classes
import { ClassIngredientsInRecipe } from '@/classes/products/ClassIngredientsInRecipe';

// Vue
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

const { t } = useI18n()

const ingredients = defineModel<IIngredientsInRecipe[]>('ingredients-in-recipe', { required: true })
const selectedItems = ref<IIngredient[]>([])

watch(selectedItems, (newSelected) => {
  const updatedIngredients = newSelected.map(ing => {
    const existing = ingredients.value.find(
      item => (item.ingredient?.idIngredient || item.ingredient.idIngredient) === ing.idIngredient
    );

    if (existing) return existing;

    const newIngredientInRecipe = ClassIngredientsInRecipe.defaultIngredientsInRecipe();
    newIngredientInRecipe.ingredient = ing;
    newIngredientInRecipe.ingredient.idIngredient = ing.idIngredient;
    return newIngredientInRecipe;
  });

  ingredients.value = updatedIngredients;
}, { deep: true });

watch(ingredients, (newIngredients) => {
  if (newIngredients && selectedItems.value.length === 0 && newIngredients.length > 0) {
    selectedItems.value = newIngredients
      .filter(i => i.ingredient)
      .map(i => i.ingredient as IIngredient);
  }
}, { immediate: true });

const dialogSearchIngredients = new ClassBaseDialog({
  maxWidth: 600
})

function handleSearchIngredients() {
  dialogSearchIngredients.toggleDialog()
}

</script>
