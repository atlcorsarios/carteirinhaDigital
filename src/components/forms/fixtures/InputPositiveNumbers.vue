<template>
  <v-text-field
    v-model="internalModel"
    :rules="specificRules"
    :label="t(label)"
    :hint="t(hint)"
    :suffix="suffix"
    :prefix="prefix"
    :color="color"
    :density="density"
    :variant="variant"
    :min="minValue"
    :max="maxValue"
    type="number"
    @keydown="blockInvalidKeys"
  />
</template>

<script setup lang="ts">
import type { IPropsCustomInputNumber } from '@/classes/models/modelComponents/ModelCustomInputs';
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();
const rules = useRules();

const model = defineModel<number | undefined>('model', { required: true });
const props = withDefaults(defineProps< IPropsCustomInputNumber>(), {
  maxValue: 100,
  minValue: 0,
  label: 'forms.formBeneficios.desconto_aplicavel.label',
  hint: 'forms.formBeneficios.desconto_aplicavel.hint',
  density: 'compact',
  variant: 'outlined'
});

const maxRule = (v: any) =>
  props.maxValue == null ||
  Number(v) <= props.maxValue ||
  t('messages.rules.max', { max: props.maxValue })

const minRule = (v: any) =>
  props.minValue == null ||
  Number(v) >= props.minValue ||
  t('messages.rules.min', { min: props.minValue })

const specificRules = [
  rules.required(),
  minRule,
  maxRule
]

function blockInvalidKeys(e: { key: string; preventDefault: () => void; }) {
  if (['-', '+', 'e', 'E'].includes(e.key)) {
    e.preventDefault()
  }
}

const internalModel = computed({
  get: () => model.value,
  set: (value: any) => {
    if (value == null || value === '') {
      model.value = undefined
      return
    }

    let numeric = String(value).replace(/[^\d]/g, '')

    if (numeric === '') {
      model.value = undefined
      return
    }

    const min = props.minValue ?? 0
    const max = props.maxValue ?? 100

    model.value = Math.min(Math.max(Number(numeric), min), max)
  }
})

</script>
