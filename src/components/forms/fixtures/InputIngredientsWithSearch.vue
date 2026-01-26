<!-- <v-col cols="12">
  <v-select
    v-model="ingredient.ingredients"
    item-title="ingredient.description"
    item-value="ingredient.idIngredient"
    :items="ingredient.ingredients"
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

    <template v-if="loadingIngredients" #append-inner>
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </template>
  </v-select>
</v-col>

<v-col
  v-if="ingredient.ingredients.length > 0"
  v-for="(item, index) in ingredient.ingredients"
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
</v-col> -->
