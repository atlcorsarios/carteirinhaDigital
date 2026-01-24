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
      <GridDataChart :hidden-chart="true">
        <template #dataTable>
          <DataTable
            :id="tableId"
            :has-actions="false"
            v-model:dataTable="gridConfig.modelTable"
            v-model:pagination="paginationModel"
            @selected-item="handleSelectItem"
            @load-more="loadMore"
          />
        </template>
      </GridDataChart>
    </template>

    <template v-slot:actions>
      <v-spacer />
      <BtnOpenDialog
        v-tooltip="t('tooltips.forms.create')"
        icon="mdi-tag-plus"
        @click="handleCreateNewCategory"
      />
    </template>
  </BaseDialog>

  <CreatedFastCategory
    v-model:dialog-create-quickly="classDialogCreateQuickly"
    @created-fast-item="handleCreateQuickly"
  />
</template>

<script setup lang="ts">
// componentes
import BaseDialog from '../../BaseDialog.vue'
import BtnOpenDialog from '../../BtnOpenDialog.vue'
import SearchForm from '@/components/forms/SearchForm.vue'
import GridDataChart from '@/components/layouts/GridDataChart.vue'
import DataTable from '@/components/DataTable.vue'
import CreatedFastCategory from './CreatedFastCategory.vue'

// Models
import type { IModelBaseDialog } from '@/classes/models/modelComponents/ModelBaseDialog'
import type { ICategory } from '@/classes/models/ModelIProduct'
import type { TPagination } from '@/classes/models/ModelHeaderPaginator'

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { ClassCategories } from '@/classes/products/ClassCategories'
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'

// Services
import { categoriesServices } from '@/services/resources/categoriesService'

// Composables
import { useInfiniteList } from '@/composables/useInfiniteList'
import { useSnackbar } from '@/composables/useSnackbar'

// Vue
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed, nextTick, ref, watchEffect } from 'vue'

const { t } = useI18n()
const route = useRoute()
const { notify } = useSnackbar()

const classDialogSearchCategory = defineModel<any>('dialog-search-category', { required: true })

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

// Grid e DataTable
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
  gridConfig.modelTable.model.titleTable = t('dataTable.categories.title')

  gridConfig.modelChart.optionsFilterSelectData = optionsChartFilter.value
})

const emits = defineEmits<{
  (e: 'select-item', item: ICategory): void
}>()

function handleSelectItem(item: ICategory) {
  emits('select-item', item)
  classDialogSearchCategory.value.toggleDialog()
}

const classDialogCreateQuickly = new ClassBaseDialog({
  persistent: false,
  maxHeight: 300
})

function handleCreateNewCategory() {
  classDialogCreateQuickly.toggleDialog()
}

function handleCreateQuickly(createdFastItem: ICategory) {
  handleSelectItem(createdFastItem)
}

</script>
