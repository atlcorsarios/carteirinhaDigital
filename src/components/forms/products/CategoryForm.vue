<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense class="d-flex justify-center">
      <v-col cols="12" md="9">
        <v-text-field
          v-model="categoryForm.description"
          :rules="[rules.required(), rules.maxLength(100)]"
          :label="t('forms.formCategory.description.label')"
          density="compact"
          variant="outlined"
          counter
          clearable
        />
      </v-col>

      <v-col cols="12" md="3">
        <v-checkbox
          v-model="categoryForm.active"
          :label="t('forms.formProduct.active.label')"
          color="success"
          class="m-0 p-0"
        />
      </v-col>
    </v-row>
    <slot name="actions" />
  </v-form>
</template>

<script setup lang="ts">
import type { ICategory } from '@/classes/models/ModelIProduct';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue'

const rules = useRules();
const { t } = useI18n();

const formRef = ref<any>(null);
const categoryForm = defineModel<ICategory>('category', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

defineExpose({
  reset: () => formRef.value?.resetValidation(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  }
});
</script>
