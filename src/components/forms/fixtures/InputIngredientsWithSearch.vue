<template>
  <v-row dense>
    <v-col cols="12">
      <v-select
        v-model="selectedItens"
        item-title="description"
        item-value="idIngredient"
        :items="selectedItens"
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
      <v-number-input
        v-model.number="item.amount"
        :suffix="item.ingredient?.measurement"
        :label="item.ingredient?.description"
        :precision="2"
        :min="0"
        control-variant="stacked"
        density="compact"
        variant="outlined"
      />
    </v-col>
  </v-row>

  <DialogSearchIngredients
    v-model:selectedItens="selectedItens"
    v-model:dialog-search-ingredient="dialogSearchIngredients"
  />
</template>

<script setup lang="ts">
// Componentes
import DialogSearchIngredients from '@/components/dialog/searchs/ingredients/DialogSearchIngredients.vue'

// Models
import { type IIngredient, type IIngredientsInRecipe } from '@/classes/models/ModelIProduct'

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassIngredientsInRecipe } from '@/classes/products/ClassIngredientsInRecipe'

// Vue
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'

const { t } = useI18n()

const ingredients = defineModel<IIngredientsInRecipe[]>('ingredients-in-recipe', { required: true })
const selectedItens = ref<IIngredient[]>([])

watch(selectedItens, (newSelected) => {
  const currentIds = ingredients.value.map(i => i.ingredient.idIngredient).sort().join(',');
  const nextIds = newSelected.map(i => i.idIngredient).sort().join(',');

  if (currentIds === nextIds) return;

  const updatedIngredients = newSelected.map(ing => {
    const existing = ingredients.value.find(
      item => (item.ingredient?.idIngredient || item.ingredient.idIngredient) === ing.idIngredient
    );

    if (existing) return existing;

    return {
      ...ClassIngredientsInRecipe.defaultIngredientsInRecipe(),
      ingredient: ing,
      idIngredient: ing.idIngredient,
      amount: 0
    };
  });

  ingredients.value = updatedIngredients;
}, { deep: true });

watch(ingredients, (newIngredients) => {
  if (!newIngredients) return;

  if (newIngredients.length !== selectedItens.value.length) {
    const newSelected = newIngredients
      .filter(i => i.ingredient)
      .map(i => i.ingredient as IIngredient);

    selectedItens.value = newSelected;
  }
}, { immediate: true });

const dialogSearchIngredients = new ClassBaseDialog({
  maxWidth: 600,
})

function handleSearchIngredients() {
  dialogSearchIngredients.toggleDialog()
}

</script>
