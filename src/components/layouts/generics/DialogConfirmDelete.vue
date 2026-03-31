<template>
  <BaseDialog v-model:attributes="dialogManager.model">
    <template v-slot:title>
      <div class="d-flex align-center text-error font-weight-bold">
        <v-icon
          icon="mdi-alert-circle"
          class="mr-2"
        />
        {{ t(textTitle) }}
      </div>
    </template>

    <template v-slot:default>
      <div class="pt-2 text-body-1">
        {{ t(textConfirm) }}
      </div>
    </template>

    <template v-slot:actions>
      <v-btn
        variant="text"
        color="grey-darken-1"
        :disabled="loading"
        @click="closeDialog"
      >
        {{ t('tooltips.forms.cancel', 'Cancelar') }}
      </v-btn>
      <v-btn
        variant="flat"
        color="error"
        :loading="loading"
        @click="executeDelete"
      >
        {{ t('tooltips.forms.submit', 'Confirmar') }}
      </v-btn>
    </template>

  </BaseDialog>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { useGenericListStore } from '@/stores/genericListStore'
import { useSnackbar } from '@/composables/useSnackbar'
import { useI18n } from 'vue-i18n'
import { nextTick, ref } from 'vue'

const { t } = useI18n()
const { notify } = useSnackbar()
const listStore = useGenericListStore()

const props = withDefaults(defineProps<{
  idField: string
  contextId: string
  serviceDelete?: (id: any) => Promise<void>
  textTitle?: string
  textConfirm?: string
  messageSuccess?: string
}>(), {
  textTitle: 'messages.dialogs.confirmInactive.title',
  textConfirm: 'messages.dialogs.confirmInactive.message',
  messageSuccess: 'messages.forms.inactiveSuccess'
})

const emit = defineEmits(['deleted', 'error'])

const dialogManager = new ClassBaseDialog({ maxWidth: 450 })
const itemToDelete = ref<T | null>(null)
const loading = ref(false)

function openDialog(item: T) {
  itemToDelete.value = item
  dialogManager.model.view = true
}

function closeDialog() {
  dialogManager.model.view = false
  itemToDelete.value = null
}

async function executeDelete() {
  if (!itemToDelete.value || !props.serviceDelete) return

  loading.value = true
  try {
    const idItem = itemToDelete.value[props.idField]
    await props.serviceDelete(idItem)

    notify(t(props.messageSuccess), 'success')
    emit('deleted', itemToDelete.value)

    closeDialog()

    await nextTick()

    listStore.updateItem(props.contextId, props.idField, idItem, { ativo: false });

  } catch (error: any) {
    notify(error, 'error')
    emit('error', error)
  } finally {
    loading.value = false
  }
}

defineExpose({
  openDialog
});

</script>
