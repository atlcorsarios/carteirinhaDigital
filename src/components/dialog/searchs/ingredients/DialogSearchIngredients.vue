<template>
  <BaseDialog v-model:attributes="classDialogSearchIngredient.model">
    <template v-slot:title>
      <div class="w-100">
        <SearchForm
          ref="refSearchForm"
          v-model:manager="classFormQuery"
          v-model:dialogAttributes="classDialogQueryFilter.model"
          v-model:tab="activeTab"
          :loading="loadingSearchForm"
          :has-filters="true"
          :title-dialog-filter="t('dialogSearch.searchIngredient.title')"
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
        @click="handleCreateNewIngredient"
      />
    </template>
  </BaseDialog>

  <CreatedFastIngredient
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
import CreatedFastIngredient from './CreatedFastIngredient.vue'

// Models
import { type IIngredient } from '@/classes/models/ModelIProduct'
import { type TPagination } from '@/classes/models/ModelHeaderPaginator'

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { ClassIngredients } from '@/classes/products/ClassIngredients'
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'

// Services
import { ingredientsServices } from '@/services/resources/products/ingredientsService'

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

const classDialogSearchIngredient = defineModel<any>('dialog-search-ingredient', { required: true })

// Models para o SearchForm
const refSearchForm = ref<InstanceType<typeof SearchForm> | null>(null)
const classFormQuery = new ClassQueryFilter([], {
  columns: ClassIngredients.filters,
  storageContext: 'dialog_search_ingredients',
  defaultFilter: ClassIngredients.defaultFilterConfig
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
const headers = computed(() => ClassIngredients.headers)
const optionsChartFilter = computed(() => headers.value.map((h) => h.title).slice(0, -1))

const gridManager = new ClassGridDataChart<IIngredient>({
  modelTable: {
    model: {
      titleTable: t('dataTable.ingredients.title'),
    }
  }
})

const gridConfig = gridManager.model

const { limit, offset, total, items, isFinished, loading, tableId, loadMore } = useInfiniteList<IIngredient>(
  route.fullPath,
  ingredientsServices.getAllIngredients
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
  gridConfig.modelTable.model.titleTable = t('dataTable.ingredients.title')

  gridConfig.modelChart.optionsFilterSelectData = optionsChartFilter.value
})

const emits = defineEmits<{
  (e: 'select-item', item: IIngredient): void
}>()

function handleSelectItem(item: IIngredient) {
  emits('select-item', item)
  classDialogSearchIngredient.value.toggleDialog()
}

const classDialogCreateQuickly = new ClassBaseDialog({
  persistent: false,
  maxWidth: 500
})

function handleCreateNewIngredient() {
  classDialogCreateQuickly.toggleDialog()
}

function handleCreateQuickly(createdFastItem: IIngredient) {
  handleSelectItem(createdFastItem)
}

</script>
