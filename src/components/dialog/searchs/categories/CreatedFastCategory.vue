<template>
  <GenericCreateQuickly
    :title="t('messages.forms.formCategory.createCategory')"
    :icon="'mdi-tag-plus'"
    :save-icon="'mdi-tag-check'"
    :dialog-model="dialogModel"
    :class-manager="categoryManager"
    :service-save="categoriesServices.saveCategory"
    @created-fast-item="(item) => $emit('created-fast-item', item)"
  >
    <template #form="{ model, updateValid, refForm, submitForm }">
      <CategoryForm
        :ref="refForm"
        :category="model"
        @update:category="(val) => Object.assign(model, val)"
        @update:valid="updateValid"
        @submit="submitForm"
        :create-fast="true"
      />
    </template>
  </GenericCreateQuickly>
</template>

<script setup lang="ts">
// Componentes
import GenericCreateQuickly from '../GenericCreateQuickly.vue'
import CategoryForm from '@/components/forms/products/CategoryForm.vue'

// Classes
import { ClassCategories } from '@/classes/products/ClassCategories'

// Services
import { categoriesServices } from '@/services/resources/products/categoriesService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialogModel = defineModel<any>('dialog-create-quickly', { required: true })
defineEmits(['created-fast-item'])

const classCategory = new ClassCategories()
const categoryManager = {
  model: classCategory.model,
  reset: () => classCategory.reset(),
}

</script>
