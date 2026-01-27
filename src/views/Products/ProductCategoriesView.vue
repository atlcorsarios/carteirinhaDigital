<template>
  <GenericView
    :headers="ClassCategories.headers"
    :id-field="'idCategory'"
    :title="t('dataTable.categories.title')"
    :hasActions="true"
    :text-create="t('messages.forms.formCategory.createCategory')"
    :text-edit="t('messages.forms.formCategory.editingCategory')"
    :icon-create="'mdi-tag-plus'"
    :icon-edit="'mdi-pencil-outline'"
    :icon-save="'mdi-tag-check'"
    :dialog-model-manager="dialogCategory"
    :class-model-manager="categoryModelManager"
    :service-fetch="categoriesServices.getAllCategories"
    :service-save="categoriesServices.saveCategory"
  >
    <template #form="{ model, updateValid }">
      <CategoryForm
        :category="model"
        @update:valid="updateValid"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
// Componentes
import GenericView from '@/views/view/GenericView.vue'
import CategoryForm from '@/components/forms/products/CategoryForm.vue'

// Models
import type { ICategory } from '@/classes/models/ModelIProduct'

// Classes
import { ClassCategories } from '@/classes/products/ClassCategories'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { categoriesServices } from '@/services/resources/products/categoriesService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const classCategory = new ClassCategories()
const dialogCategory = new ClassBaseDialog<ICategory>({
  persistent: true,
  maxWidth: 800,
})

const categoryModelManager = {
  model: classCategory.model,
  reset: () => classCategory.reset(),
  updateModel: (item: any) => {
    classCategory.updateModel(item)
  },
}
</script>
