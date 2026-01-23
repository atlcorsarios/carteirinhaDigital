<template>
  <BaseDialog v-model:attributes="classDialogSearchCategory.model">
    <template v-slot:title>
      <div class="w-100">
        <SearchForm
          ref="refSearchForm"
          v-model:manager="classFormQuery"
          v-model:dialogAttributes="classDialogQueryFilter.model"
          v-model:tab="activeTab"
          :loading="loadingSearchForm"
          :has-filters="true"
          :title-dialog-filter="t('dialogSearch.searchCategory.title')"
          @submit="handleSearch"
          @reset="handleReset"
          @add-filter="handleAddFilter"
          @open-filter="handleOpenFilter"
        />
      </div>
    </template>

    <template v-slot:default>
      <GridDataChart
      :hidden-chart="true"
    >
      <template #dataTable>
        <DataTable
          :id="tableId"
          :has-actions="false"
          v-model:dataTable="gridConfig.modelTable"
          v-model:pagination="paginationModel"
          @selected-item="openQuickRegister"
          @load-more="loadMore"
        />
      </template>
    </GridDataChart>
    </template>

    <template v-slot:actions>
      <v-spacer />
      <BtnOpenDialog
        v-tooltip="t('tooltips.forms.create')"
        icon="mdi-plus"
        text="Nova Categoria"
        color="primary"
        @click="openQuickRegister"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../BaseDialog.vue'
import BtnOpenDialog from '../BtnOpenDialog.vue'
import SearchForm from '@/components/forms/SearchForm.vue'
import GridDataChart from '@/components/layouts/GridDataChart.vue'
import DataTable from '@/components/DataTable.vue'
import type { IModelBaseDialog } from '@/classes/models/modelComponents/ModelBaseDialog'
import type { ICategory } from '@/classes/models/ModelIProduct'
import type { TPagination } from '@/classes/models/ModelHeaderPaginator'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { ClassCategories } from '@/classes/products/ClassCategories'
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'
import { categoriesServices } from '@/services/resources/categoriesService'
import { useInfiniteList } from '@/composables/useInfiniteList'
import { useSnackbar } from '@/composables/useSnackbar'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed, nextTick, ref, watchEffect } from 'vue'

const { t } = useI18n()
const route = useRoute()
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
const loadingSearchForm = ref(false)

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

  loadingSearchForm.value = true

  if (classDialogQueryFilter.model.view) {
    classDialogQueryFilter.toggleDialog()
  }

  const filtrosParaEnviar = [...classFormQuery.model]
  if (hasTextQuery) {
    filtrosParaEnviar.push(classFormQuery.stagingModel)
  }

  setTimeout(() => (loadingSearchForm.value = false), 2000)
}

// DataTable
const headers = computed(() => ClassCategories.headers)
const optionsChartFilter = computed(() => headers.value.map((h) => h.title).slice(0, -1))

const gridManager = new ClassGridDataChart<ICategory>({
  modelTable: {
    model: {
      titleTable: t('dataTable.categories.title'),
    }
  }
})

const gridConfig = gridManager.model

const { limit, offset, total, items, isFinished, loading, tableId, loadMore } = useInfiniteList<ICategory>(
  route.fullPath,
  categoriesServices.getAllCategories
);

const paginationModel = computed({
  get: () => ({
    limit: limit.value,
    offset: offset.value,
    total: total.value,
    isFinished: isFinished.value
  } as TPagination),
  set: (val: TPagination) => {
    limit.value = val.limit;
  }
});

watchEffect(() => {
  gridConfig.modelTable.model.itemsTable = items.value
  gridConfig.modelTable.model.loadingDataTable = loadingSearchForm.value
  gridConfig.modelTable.model.headersTable = headers.value
  gridConfig.modelTable.model.titleTable = t('dataTable.users.title')

  gridConfig.modelChart.optionsFilterSelectData = optionsChartFilter.value
})


function openQuickRegister() {

}

defineExpose({
  toggleDialog: () => classDialogSearchCategory.toggleDialog(),
})
</script>
