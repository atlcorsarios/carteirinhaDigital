<template>
  <BaseDialog v-model:attributes="dialogModel.model">
    <template v-slot:title>
      <v-icon
        :icon="icon"
        size="small"
        class="mr-2"
      />
      {{ title }}
    </template>

    <template v-slot:default>
      <v-overlay
        :model-value="loading"
        contained
        class="align-center justify-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </v-overlay>

      <slot
        name="form"
        :ref-form="(el: any) => refForm = el"
        :model="classManager.model"
        :is-valid="isFormValid"
        :update-valid="(val: boolean) => isFormValid = val"
        :submit-form="handleSubmit"
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
        @click="handleSubmit"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Componentes
import BaseDialog from '../BaseDialog.vue'

// Classes
import type { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Composables
import { useSnackbar } from '@/composables/useSnackbar'

// Vue
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const { notify } = useSnackbar()

const isFormValid = ref(false)
const loading = ref(false)
const refForm = ref<any>(null)

const emits = defineEmits(['created-fast-item'])
const props = defineProps<{
  title: string
  icon: string
  saveIcon?: string
  dialogModel: ClassBaseDialog<any>
  serviceSave?: (item: T) => Promise<any>
  classManager: {
    model: T
    reset: () => void
  }
}>()

function handleReset() {
  props.classManager.reset()
  if (refForm.value?.reset) {
    refForm.value.reset()
  }
  isFormValid.value = false
}

async function handleSubmit() {
  if (!isFormValid.value) return

  loading.value = true
  try {
    let savedItem = { ...props.classManager.model }

    if (props.serviceSave) {
      const response = await props.serviceSave(props.classManager.model)
      if (response) savedItem = response
    }

    notify(t('messages.forms.saveSuccess'), 'success')
    emits('created-fast-item', savedItem)

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
