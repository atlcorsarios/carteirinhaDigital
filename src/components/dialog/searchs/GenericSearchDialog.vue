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
      <GenericInfiniteList
        ref="infiniteListRef"
        :context-id="`search-dialog-${storageContext}`"
        :showEmpty="false"
        :fetch-data="adapterFetch"
        :listen-global-filters="false"
        :cursor-key="cursorKey"
      >
        <template v-slot="{ items, loading }">
          <GridDataChart :hidden-chart="true">
            <template #dataTable>
              <DataTable
                :id="`table-search-${storageContext}`"
                :headers="headers"
                :items="items"
                :loading="loading"
                :title="title"
                :has-actions="false"
                :select-items="selectItems"
                :multiple-select="isMultiple"
                v-model:selected-itens="selectedItens"
                v-model:dataTable="gridConfig.modelTable"
                @selected-item="handleSelectItem"
              />
            </template>
          </GridDataChart>
        </template>
      </GenericInfiniteList>
    </template>

    <template v-slot:actions>
      <slot
        v-if="hasCreateQuickly"
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
import GenericInfiniteList from '@/components/layouts/generics/GenericInfiniteList.vue'
import GridDataChart from '@/components/layouts/dataChart/GridDataChart.vue'
import DataTable from '@/components/layouts/dataChart/DataTable.vue'

// Models
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter'

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'

// Stores
import { useGenericListStore } from '@/stores/genericListStore'

// Composables
import { useSnackbar } from '@/composables/useSnackbar'

// Vue
import { useI18n } from 'vue-i18n'
import { ref, watch, nextTick } from 'vue'

const { t } = useI18n();
const { notify } = useSnackbar();
const listStore = useGenericListStore()

const props = withDefaults(defineProps<{
  title: string
  storageContext: string
  cursorKey?: string
  filters: any[]
  headers: any[]
  hasCreateQuickly: boolean
  defaultFilter: any
  serviceFetch: any
  staticFilters?: IQueryFilter[]
  dialogSearchModel: ClassBaseDialog
  selectItems?: boolean
  isMultiple?: boolean
}>(), {
  cursorKey: 'created_at'
});

const selectedItens = defineModel<T[]>('selectedItens', { default: () => [] });
const emits = defineEmits(['select-item']);

const refSearchForm = ref<any>(null);
const infiniteListRef = ref<InstanceType<typeof GenericInfiniteList> | null>(null);

const classFormQuery = new ClassQueryFilter([], {
  columns: props.filters,
  storageContext: props.storageContext,
  defaultFilter: props.defaultFilter
});

const classDialogQueryFilter = new ClassBaseDialog({ view: false, maxHeight: 500, maxWidth: 600 });
const activeTab = ref('form');
const loadingSearchForm = ref(false);

const handleOpenFilter = () => {
  classFormQuery.resetStaging();
  classDialogQueryFilter.toggleDialog()
}

const handleAddFilter = async () => {
  if (classFormQuery.addFilter()) {
    await nextTick();
    refSearchForm.value?.reset()
  } else notify(t('messages.components.queryFilter.alertDuplicate'), 'warning');
}

const handleReset = async () => {
  classFormQuery.resetStaging()
  if (activeTab.value === 'form') {
    await nextTick(); refSearchForm.value?.reset()
  } else {
    classFormQuery.reset();
    activeTab.value = 'form'
  }

  if (infiniteListRef.value) infiniteListRef.value.resetAndLoad()
}

const handleSearch = () => {
  if (infiniteListRef.value) infiniteListRef.value.resetAndLoad()
}

const adapterFetch = async (limit: number, cursor: any) => {
  loadingSearchForm.value = true
  try {
    const payload: TPayloadRequestPagination = {
      limit,
      cursor,
      filters: [
        ...(props.staticFilters || []),
        ...classFormQuery.model
      ]
    }
    return await props.serviceFetch(payload)
  } finally {
    loadingSearchForm.value = false
  }
}

const gridManager = new ClassGridDataChart<T>({ modelTable: { model: { titleTable: props.title } } })
const gridConfig = gridManager.model

const classDialogCreateQuickly = new ClassBaseDialog({ maxWidth: 500 });

function handleSelectItem(item: T) {
  if (props.selectItems) {
    if (!props.isMultiple) {
      selectedItens.value = [item]
    } else {
      const index = selectedItens.value.indexOf(item)
      if (index > -1) {
        selectedItens.value.splice(index, 1)
      } else {
        selectedItens.value.push(item)
      }
    }
  }
  props.dialogSearchModel.toggleDialog()
  emits('select-item', item)
}

function handleCreateQuickly(newItem: any) {
  listStore.prependItem(`search-dialog-${props.storageContext}`, newItem)

  if (props.isMultiple) {
    if (!selectedItens.value) selectedItens.value = []
    const exists = selectedItens.value.find((i: any) => i.id === newItem.id)
    if (!exists) selectedItens.value.push(newItem)

  } else {
    selectedItens.value = [newItem]
  }

  if (classDialogCreateQuickly) {
    classDialogCreateQuickly.model.view = false
  }
}

watch(() => props.dialogSearchModel.model.view, (isOpen) => {
  if (isOpen) {
    const currentItems = listStore.getItems(`search-dialog-${props.storageContext}`)

    if (currentItems.length === 0) {
      setTimeout(() => {
        if (infiniteListRef.value && infiniteListRef.value.loadMore) {
          infiniteListRef.value.loadMore({ done: () => {} })
        }
      }, 200)
    }
  }
})

</script>
