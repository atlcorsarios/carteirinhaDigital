<template>
  <BaseDialog v-model:attributes="classDialogSearchRecipe.model">
    <template v-slot:title>
      <div class="w-100">
        <SearchForm
          ref="refSearchForm"
          v-model:manager="classFormQuery"
          v-model:dialogAttributes="classDialogQueryFilter.model"
          v-model:tab="activeTab"
          :loading="loadingSearchForm"
          :has-filters="true"
          :title-dialog-filter="t('dialogSearch.searchRecipe.title')"
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
        icon="mdi-cookie-plus"
        @click="handleCreateNewRecipe"
      />
    </template>
  </BaseDialog>

  <CreatedFastRecipe
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
import CreatedFastRecipe from './CreatedFastRecipe.vue'

// Models
import { type IRecipe } from '@/classes/models/ModelIProduct'
import { type TPagination } from '@/classes/models/ModelHeaderPaginator'

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { ClassRecipes } from '@/classes/products/ClassRecipes'
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'

// Services
import { recipesServices } from '@/services/resources/products/recipesService'

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

const classDialogSearchRecipe = defineModel<any>('dialog-search-recipe', { required: true })

// Models para o SearchForm
const refSearchForm = ref<InstanceType<typeof SearchForm> | null>(null)
const classFormQuery = new ClassQueryFilter([], {
  columns: ClassRecipes.filters,
  storageContext: 'dialog_search_recipes',
  defaultFilter: ClassRecipes.defaultFilterConfig
})

const classDialogQueryFilter = new ClassBaseDialog({
  view: false,
  maxHeight: 500,
  maxWidth: 600,
})

const activeTab = ref('form')
const loadingSearchForm = ref(false)

function handleOpenFilter() {
  classFormQuery.resetStaging()

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
const headers = computed(() => ClassRecipes.headers)
const optionsChartFilter = computed(() => headers.value.map((h) => h.title).slice(0, -1))

const gridManager = new ClassGridDataChart<IRecipe>({
  modelTable: {
    model: {
      titleTable: t('dataTable.recipes.title'),
    }
  }
})

const gridConfig = gridManager.model

const { limit, offset, total, items, isFinished, loading, tableId, loadMore } = useInfiniteList<IRecipe>(
  route.fullPath,
  recipesServices.getAllRecipes
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
  gridConfig.modelTable.model.titleTable = t('dataTable.recipes.title')

  gridConfig.modelChart.optionsFilterSelectData = optionsChartFilter.value
})

const emits = defineEmits<{
  (e: 'select-item', item: IRecipe): void
}>()

function handleSelectItem(item: IRecipe) {
  emits('select-item', item)
  classDialogSearchRecipe.value.toggleDialog()
}

const classDialogCreateQuickly = new ClassBaseDialog({
  persistent: false,
  maxWidth: 500
})

function handleCreateNewRecipe() {
  classDialogCreateQuickly.toggleDialog()
}

function handleCreateQuickly(createdFastItem: IRecipe) {
  handleSelectItem(createdFastItem)
}

</script>
