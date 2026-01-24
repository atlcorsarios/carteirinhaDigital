<template>
  <BaseDialog v-model:attributes="classDialogCreateCategory.model">
    <template v-slot:title>
      <v-icon
        icon="mdi-tag-plus"
        size="small"
        class="mr-2"
      />
      {{ t('messages.forms.formCategory.createCategory') }}
    </template>

    <template v-slot:default>
      <CategoryForm
        ref="refFormCategory"
        v-model:category="classCategory.model"
        v-model:valid="isFormValid"
        :create-fast="true"
      />
    </template>

    <template v-slot:actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="resetFormCategory"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-tag-check"
        v-tooltip="t('tooltips.forms.save')"
        variant="text"
        color="success"
        :disabled="!isFormValid"
        @click="handleCreateFastItem"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../../BaseDialog.vue';
import CategoryForm from '@/components/forms/products/CategoryForm.vue';
import type { ICategory } from '@/classes/models/ModelIProduct';
import { ClassCategories } from '@/classes/products/ClassCategories';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n()

const classDialogCreateCategory = defineModel<any>('dialog-create-quickly', { required: true })

const classCategory = new ClassCategories()
const refFormCategory = ref<InstanceType<typeof CategoryForm> | null>(null)
const isFormValid = ref<boolean>(false)

const emits = defineEmits<{
  (e: 'created-fast-item', item: ICategory): void
}>()

function resetFormCategory() {
  refFormCategory.value?.reset()
  classCategory.reset()
}

function handleCreateFastItem() {
  // simular a criação com método post, depois vai enviar com id
  const idCategoryCreated = 1
  emits('created-fast-item', { ...classCategory.model, idCategory: idCategoryCreated })
  classDialogCreateCategory.value.toggleDialog()
}

</script>
