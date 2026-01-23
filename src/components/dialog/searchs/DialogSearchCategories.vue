<template>
  <BaseDialog v-model:attributes="classDialogSearchCategory.model">
    <template v-slot:title>
      <div class="w-100">
        <SearchForm
          ref="refSearchForm"
          v-model:manager="classFormQuery"
          v-model:dialogAttributes="classDialogQueryFilter.model"
          v-model:tab="activeTab"
          :loading="loading"
          :has-filters="true"
          :title-dialog-filter="t('dialogSearch.searchCategory.title')"
          @submit="handleSearch"
          @reset="handleReset"
          @add-filter="handleAddFilter"
          @open-filter="handleOpenFilter"
        />
      </div>
    </template>

    <template v-slot:default> </template>

    <template v-slot:actions> </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../BaseDialog.vue'
import SearchForm from '@/components/forms/SearchForm.vue'
import type { IModelBaseDialog } from '@/classes/models/modelComponents/ModelBaseDialog'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { useSnackbar } from '@/composables/useSnackbar'
import { useI18n } from 'vue-i18n'
import { nextTick, ref } from 'vue'
import { ClassCategories } from '@/classes/products/ClassCategories'

const { t } = useI18n()
const { notify } = useSnackbar()

const props = defineProps<{
  dialogSearch: IModelBaseDialog
}>()

const classDialogSearchCategory = new ClassBaseDialog({
  ...props.dialogSearch,
})

// Models para o SearchForm
const refSearchForm = ref<InstanceType<typeof SearchForm> | null>(null)
const classFormQuery = new ClassQueryFilter([], {
  columns: ClassCategories.filters,
  storageContext: 'dialog_search_categories',
  defaultFilter: ClassCategories.defaultFilterConfig
})
const classDialogQueryFilter = new ClassBaseDialog({
  view: false,
  maxHeight: 500,
  maxWidth: 600,
})

const activeTab = ref('form')
const loading = ref(false)

function handleOpenFilter() {
  classFormQuery.updateStaging({
    field: classFormQuery.filters[1]?.key,
    condition: 'contains',
  })

  classDialogQueryFilter.toggleDialog()
}

async function handleAddFilter() {
  const validFilter = classFormQuery.addFilter()
  if (validFilter) {
    await nextTick()
    refSearchForm.value?.reset()
  } else {
    const errorMessage = t('messages.components.queryFilter.alertDuplicate')
    notify(errorMessage, 'warning')
  }
}

async function handleReset() {
  classFormQuery.resetStaging()
  if (activeTab.value === 'form') {
    await nextTick()
    refSearchForm.value?.reset()
  } else {
    classFormQuery.reset()
    activeTab.value = 'form'
  }
}

function handleSearch() {
  const stagingValue = classFormQuery.stagingModel.value
  const hasTextQuery = stagingValue && stagingValue.trim() !== ''
  const hasFilterList = classFormQuery.model.length > 0

  if (!hasTextQuery && !hasFilterList) {
    return
  }

  loading.value = true

  if (classDialogQueryFilter.model.view) {
    classDialogQueryFilter.toggleDialog()
  }

  const filtrosParaEnviar = [...classFormQuery.model]
  if (hasTextQuery) {
    filtrosParaEnviar.push(classFormQuery.stagingModel)
  }

  console.log('Buscando com:', filtrosParaEnviar)

  setTimeout(() => (loading.value = false), 2000)
}

defineExpose({
  toggleDialog: () => classDialogSearchCategory.toggleDialog(),
})
</script>
