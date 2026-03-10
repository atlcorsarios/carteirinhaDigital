<template>
  <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handleSubmit">
    <v-row dense align="center">
      <v-col cols="12">
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
      <v-col v-if="!createFast" cols="12" class="d-flex justify-center">
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
      />

      <v-col v-if="!createFast" cols="12">
        <v-textarea
          v-model="recipe.preparation"
          :label="t('forms.formRecipe.preparation.label')"
          density="compact"
          variant="outlined"
          auto-grow
          clearable
          @focus="handleFocus"
          @keydown.enter.prevent="handleEnter"
        />
      </v-col>
    </v-row>
    <button type="submit" class="d-none"></button>
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
import { nextTick, ref } from 'vue'

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

function handleFocus() {
  if (!recipe.value.preparation) {
    recipe.value.preparation = '1. '
  }
}

async function handleEnter(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  const start = textarea.selectionStart

  const currentText = recipe.value.preparation || ''

  const textBefore = currentText.substring(0, start)
  const textAfter = currentText.substring(start)

  const linesBeforeCursor = textBefore.split('\n')
  const nextStepNumber = linesBeforeCursor.length + 1
  const insertText = `\n${nextStepNumber}. `

  recipe.value.preparation = textBefore + insertText + textAfter

  await nextTick()
  textarea.selectionStart = textarea.selectionEnd = start + insertText.length
}

const emit = defineEmits(['submit']);

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    emit('submit');
  }
}

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  }
});
</script>
