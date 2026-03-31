<template>
  <BaseDialog v-model:attributes="manager">
    <template v-slot:title>
      <v-icon
        :icon="
          manager.formEditingMode
            ? (iconEdit ?? 'mdi-pencil')
            : (iconCreate ?? 'mdi-plus')
        "
        size="small"
        class="mr-2"
      />
      {{
        manager.formEditingMode
          ? (textEdit || t('tooltips.forms.edit')) +
            ` ${getItemIdentifier(manager.itemEdition)}`
          : textCreate || t('tooltips.forms.create')
      }}
    </template>

    <template v-slot:default>
      <slot
        name="form"
        :ref-form="(el: any) => refForm = el"
        :model="classModelManager.model"
        :is-valid="isFormValid"
        :update-valid="(val: boolean) => (isFormValid = val)"
        :submit-form="handleSubmit"
      />
    </template>

    <template v-slot:actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="resetForm"
      />

      <v-spacer />

      <v-icon-btn
        :icon="iconSave ?? 'mdi-check'"
        v-tooltip="t('tooltips.forms.save')"
        variant="text"
        color="success"
        :disabled="!isFormValid"
        @click="handleSubmit"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import BaseDialog from '@/components/dialog/BaseDialog.vue';
import type { IModelBaseDialog } from '@/classes/models/modelComponents/ModelBaseDialog';
import { useGenericListStore } from '@/stores/genericListStore';
import { useSnackbar } from '@/composables/useSnackbar';
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

const { t } = useI18n();
const { notify } = useSnackbar();
const listStore = useGenericListStore();

const isFormValid = ref(false);
const refForm = ref<any>(null);

const manager = defineModel<IModelBaseDialog<T>>('dialog-form', { required: true });
const emit = defineEmits(['saved', 'error']);
const props = defineProps<{
  idField: string
  title: string
  contextId: string
  textCreate?: string
  textEdit?: string
  showIdInTextEdit?: boolean
  iconCreate?: string
  iconEdit?: string
  iconSave?: string
  classModelManager: {
    model: T
    reset: () => void
    updateModel: (item: T) => void
  }
  serviceSave?: (item: T) => Promise<any>
}>();

function getItemIdentifier(item: any) {
  if (!item || !props.showIdInTextEdit) return ''
  if (props.idField && item[props.idField]) return item[props.idField]

  const keys = Object.keys(item)
  const idKey = keys.find((k) => k.startsWith('id'))

  return idKey ? item[idKey] : ''
}

function resetForm() {
  if (refForm.value?.reset) refForm.value.reset()
  if (manager.value.formEditingMode) {
    const itemEditing = manager.value.itemEdition
    if (itemEditing) props.classModelManager.updateModel(itemEditing)
  } else {
    props.classModelManager.reset()
  }
}

async function handleSubmit() {
  if (!isFormValid.value) return

  try {
    let itemSalvo = props.classModelManager.model

    if (props.serviceSave) {
      const response = await props.serviceSave(props.classModelManager.model)
      if (response) itemSalvo = response
    }

    notify('messages.forms.saveSuccess', 'success');
    emit('saved', itemSalvo);

    manager.value.view = !manager.value.view;

    if (manager.value.formEditingMode) {
      listStore.updateItem(props.contextId, props.idField, itemSalvo[props.idField], itemSalvo);
    } else {
      listStore.prependItem(props.contextId, itemSalvo);
    }
  } catch (error) {
    notify(error || 'messages.forms.saveError', 'error')
    emit('error', error)
  }
}

watch(() => manager.value.view, (isOpen) => {
  if (isOpen && refForm.value?.reset) {
    refForm.value.reset()
  }
});

</script>
