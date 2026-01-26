<template>
  <v-row dense>
    <v-col cols="12" md="6">
      <v-select
        v-model="ingredients"
        item-title="description"
        item-value="idIngredient"
        :items="selectedItems"
        :label="t('forms.formIngredient.ingredients.label')"
        :hint="t('forms.formIngredient.ingredients.hint')"
        density="compact"
        variant="outlined"
        chips
        clearable
        multiple
        return-object
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
        v-model="item.amount"
        :suffix="item.ingredient?.measurement ?? 'Sufix'"
        :label="item.ingredient?.description ?? 'Test'"
        type="number"
        density="compact"
        variant="outlined"
      />
    </v-col>
  </v-row>

  <DialogSearchIngredients
    :dialog-search-ingredient="dialogSearchIngredients.model"
    v-model:items-selected="selectedItems"
  />
</template>

<script setup lang="ts">
// Componentes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';
import DialogSearchIngredients from '@/components/dialog/searchs/ingredients/DialogSearchIngredients.vue';

// Models
import { type IIngredient, type IIngredientsInRecipe } from '@/classes/models/ModelIProduct';

// Vue
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n()

const ingredients = defineModel<IIngredientsInRecipe[]>('ingredients-in-recipe', { required: true })
const selectedItems = ref<IIngredient[]>([])

const dialogSearchIngredients = new ClassBaseDialog({
  maxWidth: 600
})

function handleSearchIngredients() {
  dialogSearchIngredients.toggleDialog()
}
</script>
