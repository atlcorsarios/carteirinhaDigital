<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense align="center">
      <v-col cols="12">
        <v-text-field
          v-model="stockControl.item.description"
          :label="t('forms.formStock.item.label')"
          density="compact"
          variant="outlined"
          readonly
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="stockControl.operation"
          :items="optionsOperations"
          :label="t('forms.formStock.operation.label')"
          item-value="value"
          item-title="title"
          density="compact"
          variant="outlined"
          clearable
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="stockControl.measurement"
          :rules="[rules.required()]"
          :label="t('forms.formStock.measurement.label')"
          density="compact"
          variant="outlined"
          clearable
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-number-input
          v-model="stockControl.amount"
          :rules="[rules.required()]"
          :label="t('forms.formStock.amount.label')"
          :precision="2"
          :min="1"
          controlVariant="stacked"
          density="compact"
          variant="outlined"
          clearable
          inset
        />
      </v-col>

      <v-col cols="12" md="6">
        <InputPrice
          v-model="stockControl.price"
          :rules="[rules.required()]"
          :label="t('forms.formStock.price.label')"
          :hint="t('forms.formStock.price.hint')"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Componentes
import InputPrice from '../fixtures/InputPrice.vue';

// Model
import { operations, type IStockControl } from '@/classes/models/ModelIStock';

// Vue
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

const rules = useRules()
const { t } = useI18n()

const formRef = ref<any>(null)
const stockControl = defineModel<IStockControl<T>>('stock', { required: true })
const formIsValid = defineModel<boolean>('valid', { default: false })

const optionsOperations = computed(() => {
  return operations.map((group) => ({
    title: t(`forms.formStock.operation.types.${group.toLocaleLowerCase()}`),
    value: group
  }))
})

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate()
    return valid
  },
})

</script>
