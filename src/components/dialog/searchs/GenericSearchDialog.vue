<template>
  <BaseDialog v-model:attributes="dialogSearchModel.model">
    <template v-slot:title>
      <div class="w-100">
        <SearchForm
          ref="refSearchForm"
          v-model:manager="classFormQuery"
          v-model:dialogAttributes="classDialogQueryFilter.model"
          v-model:tab="activeTab"
          :loading="loadingSearchForm"
          :has-filters="true"
          :title-dialog-filter="title"
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
            :select-items="selectItems"
            v-model:selected-itens="selectedItens"
            v-model:dataTable="gridConfig.modelTable"
            v-model:pagination="paginationModel"
            @selected-item="handleSelectItem"
            @load-more="loadMore"
          />
        </template>
      </GridDataChart>
    </template>

    <template v-slot:actions>
      <slot
        name="action-btn"
        :open-create="() => classDialogCreateQuickly.toggleDialog()"
      />
    </template>
  </BaseDialog>

  <slot
    name="create-quickly"
    :dialog-model="classDialogCreateQuickly"
    :on-created="handleCreateQuickly"
  />
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Componentes
import BaseDialog from '../BaseDialog.vue'
import SearchForm from '@/components/forms/SearchForm.vue'
import GridDataChart from '@/components/layouts/GridDataChart.vue'
import DataTable from '@/components/DataTable.vue'

// Models
import type { TPagination } from '@/classes/models/ModelHeaderPaginator'

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'

// Composables
import { useInfiniteList } from '@/composables/useInfiniteList'
import { useSnackbar } from '@/composables/useSnackbar'

// Vue
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, computed, watchEffect, nextTick } from 'vue'

const { t } = useI18n()
const route = useRoute()
const { notify } = useSnackbar()

const props = defineProps<{
  title: string
  storageContext: string
  filters: any[]
  headers: any[]
  defaultFilter: any
  serviceFetch: any
  dialogSearchModel: ClassBaseDialog
  selectItems?: boolean
}>()

const selectedItens = defineModel<T[]>('selectedItens', { default: () => [] })

const emits = defineEmits(['select-item'])

const refSearchForm = ref<any>(null)
const classFormQuery = new ClassQueryFilter([], {
  columns: props.filters,
  storageContext: props.storageContext,
  defaultFilter: props.defaultFilter
})

const classDialogQueryFilter = new ClassBaseDialog({ view: false, maxHeight: 500, maxWidth: 600 })
const activeTab = ref('form')
const loadingSearchForm = ref(false)

const handleOpenFilter = () => { classFormQuery.resetStaging(); classDialogQueryFilter.toggleDialog() }
const handleAddFilter = async () => {
  if (classFormQuery.addFilter()) { await nextTick(); refSearchForm.value?.reset() }
  else { notify(t('messages.components.queryFilter.alertDuplicate'), 'warning') }
}
const handleReset = async () => {
  classFormQuery.resetStaging()
  if (activeTab.value === 'form') { await nextTick(); refSearchForm.value?.reset() }
  else { classFormQuery.reset(); activeTab.value = 'form' }
}

const handleSearch = () => {

}

const gridManager = new ClassGridDataChart<T>({ modelTable: { model: { titleTable: props.title } } })
const gridConfig = gridManager.model
const { limit, offset, total, items, isFinished, loading, tableId, loadMore } = useInfiniteList<T>(route.fullPath, props.serviceFetch)

const paginationModel = computed({
  get: () => ({ limit: limit.value, offset: offset.value, total: total.value, isFinished: isFinished.value } as TPagination),
  set: (val: TPagination) => { limit.value = val.limit }
})

watchEffect(() => {
  gridConfig.modelTable.model.itemsTable = items.value
  gridConfig.modelTable.model.headersTable = props.headers
  gridConfig.modelTable.model.loadingDataTable = loading.value
})

const classDialogCreateQuickly = new ClassBaseDialog({ maxWidth: 500 })

function handleSelectItem(item: T) {
  if (props.selectItems) {
    selectedItens.value.push(item)
  }
  const index = selectedItens.value.indexOf(item)
  if (index > -1) {
    selectedItens.value.splice(index, 1)
  } else {
    selectedItens.value.push(item)
  }

  emits('select-item', item)
  props.dialogSearchModel.toggleDialog()
}

function handleCreateQuickly(item: T) {
  handleSelectItem(item)
}
</script>
