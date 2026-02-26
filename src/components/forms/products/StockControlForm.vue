<template>
  <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handleSubmit">
    <v-row dense align="center">
      <v-col cols="12" class="pb-0">
        <v-radio-group v-model="itemType" inline hide-details color="primary">
          <v-radio :label="t('forms.formStock.item.types.ingredient')" value="INGREDIENT" />
          <v-radio :label="t('forms.formStock.item.types.product')" value="PRODUCT" />
        </v-radio-group>
      </v-col>

      <InputIngredientWithSearch
        v-if="itemType === 'INGREDIENT'"
        v-model:ingredient="stockControl.item"
        @update:ingredient="updateDataChildrens"
      />
      <InputProductWithSearch
        v-else
        v-model:product="stockControl.item"
        @update:product="updateDataChildrens"
      />

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
          :label="'forms.formStock.price.label'"
          :hint="'forms.formStock.price.hint'"
        />
      </v-col>
    </v-row>
    <button type="submit" class="d-none"></button>
  </v-form>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Componentes
import InputPrice from '../fixtures/InputPrice.vue';
import InputIngredientWithSearch from '../fixtures/InputIngredientWithSearch.vue';

// Model
import { operations, type IStockControl } from '@/classes/models/ModelIStock';

// Vue
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { computed, ref, watch } from 'vue';
import InputProductWithSearch from '../fixtures/InputProductWithSearch.vue';

const rules = useRules()
const { t } = useI18n()

const formRef = ref<any>(null)
const stockControl = defineModel<IStockControl<T>>('stock', { required: true })
const formIsValid = defineModel<boolean>('valid', { default: false })
const itemType = ref<'INGREDIENT' | 'PRODUCT'>('INGREDIENT')

const emit = defineEmits(['submit']);

const optionsOperations = computed(() => {
  return operations.map((group) => ({
    title: t(`forms.formStock.operation.types.${group.toLocaleLowerCase()}`),
    value: group
  }))
})

watch(() => itemType.value, (newType) => {
    if (newType) {
      stockControl.value.item = {} as T;
      stockControl.value.measurement = '';
      stockControl.value.price = undefined;
    }
  },
)

function updateDataChildrens(selectedItem: any) {
  if (selectedItem) {
    stockControl.value.measurement = selectedItem.measurement || 'UN';
    stockControl.value.price = selectedItem.price || 0.0;
  }
}

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    emit('submit');
  }
}

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate()
    return valid
  },
})
</script>
