<template>
  <v-mask-input
    v-model="documento"
    :rules="[rules.required()]"
    :mask="maskDocumento"
    :label="computedLabel"
    :density="density"
    :variant="variant"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import type { IPropsCustomInputs } from '@/classes/models/modelComponents/ModelCustomInputs';
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n';
import { computed } from 'vue'

const rules = useRules()
const { te, t } = useI18n()

const documento = defineModel<string>('documento', { required: true });
const props = withDefaults(defineProps<IPropsCustomInputs>(), {
  label: 'forms.formUser.documento.label',
  density: 'compact',
  variant: 'outlined',
  disabled: false
})

const computedLabel = computed(() => te(props.label) ? t(props.label) : props.label)
const maskDocumento = computed(() => {
  return getCpfCnpjMask(documento.value)
})

function getCpfCnpjMask(value: string) {
  if (!value) return '###.###.###-##'

  const numbers = value.replace(/\D/g, '')

  if (numbers.length <= 11) return '###.###.###-##'
  return '##.###.###/####-##'
}
</script>
