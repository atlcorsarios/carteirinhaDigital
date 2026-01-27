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
        <v-switch
          v-model="recipe.active"
          :label="t('forms.formRecipe.active.label')"
          :indeterminate="recipe.active === null || recipe.active === undefined"
          color="success"
          class="m-0 p-0"
        />
      </v-col>
    </v-row>
    <v-row dense v-if="!createFast">
      <InputCategoryWithSearch
        v-model:category="recipe.category"
        :label="t('forms.formRecipe.category.label')"
        :hint="t('forms.formRecipe.category.hint')"
      />

      <InputIngredientsWithSearch
        v-model:ingredients-in-recipe="recipe.ingredients"
        v-model:selected-items="recipe.ingredients"
      />

      <v-col v-if="!createFast" cols="12">
        <v-textarea
          v-model="recipe.preparation"
          :label="t('forms.formRecipe.preparation.label')"
          density="compact"
          variant="outlined"
          clearable
        />
      </v-col>
    </v-row>
    <slot name="actions" />
  </v-form>
</template>

<script setup lang="ts">
// Componentes
import InputIngredientsWithSearch from '../fixtures/InputIngredientsWithSearch.vue';
import InputCategoryWithSearch from '../fixtures/InputCategoryWithSearch.vue';

// Models
import { type IRecipe } from '@/classes/models/ModelIProduct';

// Vue
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue'

const rules = useRules();
const { t } = useI18n();

withDefaults(defineProps<{
  createFast?: boolean
}>(), {
  createFast: false
})

const formRef = ref<any>(null);
const recipe = defineModel<IRecipe>('recipe', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  }
});

</script>
