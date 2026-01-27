<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense align="center">
      <v-col cols="12" :md="createFast ? 12 : 6">
        <v-text-field
          v-model="ingredient.description"
          :rules="[rules.required(), rules.maxLength(100)]"
          :label="t('forms.formIngredient.description.label')"
          density="compact"
          variant="outlined"
          counter
          clearable
        />
      </v-col>

      <v-col v-if="!createFast" cols="12" md="6">
        <v-text-field
          v-model="ingredient.measurement"
          :rules="[rules.required(), rules.maxLength(30)]"
          :label="t('forms.formIngredient.measurement.label')"
          density="compact"
          variant="outlined"
          counter
          clearable
        />
      </v-col>
    </v-row>
    <v-row dense v-if="!createFast">
      <v-col cols="12" md="6">
        <v-number-input
          v-model="ingredient.stock"
          :label="t('forms.formIngredient.stock.label')"
          :hint="t('forms.formIngredient.stock.hint')"
          controlVariant="stacked"
          density="compact"
          variant="outlined"
          clearable
          inset
        />
      </v-col>

      <InputCategoryWithSearch
        v-model:category="ingredient.category"
        :label="t('forms.formRecipe.category.label')"
        :hint="t('forms.formRecipe.category.hint')"
      />
    </v-row>
    <slot name="actions" />
  </v-form>
</template>

<script setup lang="ts">
import InputCategoryWithSearch from '../fixtures/InputCategoryWithSearch.vue'
import { type IIngredient } from '@/classes/models/ModelIProduct'
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const rules = useRules()
const { t } = useI18n()

withDefaults(
  defineProps<{
    createFast?: boolean
  }>(),
  {
    createFast: false,
  },
)

const formRef = ref<any>(null)
const ingredient = defineModel<IIngredient>('ingredient', { required: true })
const formIsValid = defineModel<boolean>('valid', { default: false })

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate()
    return valid
  },
})
</script>
