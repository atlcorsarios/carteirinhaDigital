<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense align="center">
      <v-col cols="12" :md="createFast ? 12 : 6">
        <v-text-field
          v-model="recipe.description"
          :rules="[rules.required(), rules.maxLength(100)]"
          :label="t('forms.formRecipe.description.label')"
          density="compact"
          variant="outlined"
          counter
          clearable
        />
      </v-col>
      <v-col v-if="!createFast" cols="12">
        <v-checkbox
          v-model="recipe.active"
          :label="t('forms.formRecipe.active.label')"
          color="success"
          class="m-0 p-0"
        />
      </v-col>
    </v-row>
    <v-row dense v-if="!createFast">
      <v-col cols="12">
        <v-select
          v-model="recipe.ingredients"
          item-title="ingredient.description"
          item-value="ingredient.idIngredient"
          :items="recipe.ingredients"
          :label="t('forms.formRecipe.ingredients.label')"
          :hint="t('forms.formRecipe.ingredients.hint')"
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
        v-if="recipe.ingredients.length > 0"
        v-for="(item, index) in recipe.ingredients"
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

      <v-col cols="12">
        <InputCategoryWithSearch
          v-model:category="recipe.category"
          :label="t('forms.formRecipe.category.label')"
          :hint="t('forms.formRecipe.category.hint')"
        />
      </v-col>
    </v-row>
    <slot name="actions" />
  </v-form>
</template>

<script setup lang="ts">
import InputCategoryWithSearch from '../fixtures/InputCategoryWithSearch.vue';
import { type IRecipe } from '@/classes/models/ModelIProduct';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue'

const rules = useRules();
const { t } = useI18n();

const loadingIngredients = ref<boolean>(false)

withDefaults(defineProps<{
  createFast?: boolean
}>(), {
  createFast: false
})

const formRef = ref<any>(null);
const recipe = defineModel<IRecipe>('recipe', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

function handleSearchIngredients() {

}

defineExpose({
  reset: () => formRef.value?.resetValidation(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  }
});

</script>
