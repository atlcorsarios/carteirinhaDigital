<template>
  <BaseDialog v-model:attributes="dialogModel.model">
    <template v-slot:title>
      <v-icon :icon="icon" size="small" class="mr-2" />
      {{ title }}
    </template>

    <template v-slot:default>
      <v-overlay :model-value="loading" contained class="align-center justify-center">
        <v-progress-circular indeterminate color="primary" />
      </v-overlay>

      <slot
        name="form"
        :model="classManager.model"
        :update-valid="(val: boolean) => isFormValid = val"
        :ref-form="refForm"
      />
    </template>

    <template v-slot:actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        :disabled="loading"
        @click="handleReset"
      />

      <v-spacer />

      <v-icon-btn
        :icon="saveIcon || 'mdi-check'"
        v-tooltip="t('tooltips.forms.save')"
        variant="text"
        color="success"
        :disabled="!isFormValid || loading"
        :loading="loading"
        @click="handleSave"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSnackbar } from '@/composables/useSnackbar'
import type { ClassBaseDialog } from '@/classes/ClassBaseDialog'

const props = defineProps<{
  title: string
  icon: string
  saveIcon?: string
  dialogModel: ClassBaseDialog<any>
  // Prop para o serviço de API
  serviceSave?: (item: T) => Promise<any>
  classManager: {
    model: T
    reset: () => void
  }
}>()

const emits = defineEmits(['created-fast-item'])
const { t } = useI18n()
const { notify } = useSnackbar()

const isFormValid = ref(false)
const loading = ref(false)
const refForm = ref<any>(null)

function handleReset() {
  if (refForm.value?.reset) refForm.value.reset()
  props.classManager.reset()
}

async function handleSave() {
  loading.value = true
  try {
    let savedItem = { ...props.classManager.model }

    // Se um serviço foi passado, realiza a chamada de API
    if (props.serviceSave) {
      const response = await props.serviceSave(props.classManager.model)
      // Assume-se que a API retorna o objeto criado (com ID)
      if (response) savedItem = response
    }

    notify(t('messages.forms.saveSuccess'), 'success')
    emits('created-fast-item', savedItem)

    // Fecha o dialog e limpa o form
    props.dialogModel.toggleDialog()
    handleReset()
  } catch (error) {
    console.error(error)
    notify(t('messages.forms.saveError'), 'error')
  } finally {
    loading.value = false
  }
}
</script>

