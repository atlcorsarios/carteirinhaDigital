<template>
  <v-container fluid class="fill-height">
    <GenericInfiniteList
      ref="infiniteListRef"
      :cursor-key="idField"
      :context-id="contextId"
      :showEmpty="false"
      :fetch-data="adapterFetch"
    >
      <template v-slot="{ items, loading }">
        <GridDataChart
          :hidden-chart="gridConfig.modelTable.model.hiddenChart"
          :selected-item="selectedItem"
          @toggle-chart="toggleChartState"
        >
          <template v-if="!loading" #dataTable>
            <DataTable
              :id="contextId"
              :headers="headers"
              :items="items"
              :loading="loading"
              :title="title"
              :selectItems="selectItems"
              :hasActions="hasActions"
              v-model:selected-itens="selectedItens"
              v-model:dataTable="gridConfig.modelTable"
              @selected-item="handleSelection"
              @toggle-chart="toggleChartState"
              @manage-record="handleManageRecord"
              @delete-item="handleDeleteRequest"
            />
          </template>

          <template #dataChart>
            <ChartPie
              v-model:selectedFilter="selectedChartFilter"
              :key="String(gridConfig.modelTable.model.hiddenChart)"
              :chart-data="getChartData(items)"
              :filter-options="headersToGraph"
              :active-config="activeHeaderConfig"
            />
          </template>

          <template v-if="selectedItem && hasMoreDetails" #moreDetails>
            <slot
              name="moreDetails"
              :item="selectedItem"
              :close="hiddenMoreDetails"
            />
          </template>
        </GridDataChart>
      </template>
    </GenericInfiniteList>
  </v-container>

  <DialogFormGenericView
    v-model:dialog-form="dialogModelManager.model"
    :id-field="idField"
    :title="title"
    :context-id="contextId"
    :text-create="textCreate"
    :text-edit="textEdit"
    :show-id-in-text-edit="showIdInTextEdit"
    :icon-create="iconCreate"
    :icon-edit="iconEdit"
    :icon-save="iconSave"
    :class-model-manager="classModelManager"
    :service-save="serviceSave"
    @saved="(item) => emit('saved', item)"
    @error="(err) => emit('error', err)"
  >
    <template #form="slotProps">
      <slot
        name="form"
        v-bind="slotProps"
      />
    </template>
  </DialogFormGenericView>

  <DialogConfirmDelete
    ref="confirmDeleteRef"
    :id-field="idField"
    :context-id="contextId"
    :service-delete="serviceDelete"
    @deleted="(item) => emit('deleted', item)"
  />
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Componentes
import GenericInfiniteList from './GenericInfiniteList.vue'
import GridDataChart from '@/components/layouts/dataChart/GridDataChart.vue'
import DataTable from '@/components/layouts/dataChart/DataTable.vue'
import ChartPie from '@/components/layouts/dataChart/ChartPie.vue'
import DialogFormGenericView from './DialogFormGenericView.vue'
import DialogConfirmDelete from './DialogConfirmDelete.vue'

// Classes
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Composables
import { useChartHelpers } from '@/composables/useChartHelpers'
import { useStringColor } from '@/composables/useStringColor'

// Vue
import { ref, computed } from 'vue'

interface IConfirmDeleteExpose {
  openDialog: (item: T) => void
}

const { stringToColor } = useStringColor();

const selectedItens = defineModel<any[]>('selected-itens', { required: false });
const emit = defineEmits(['saved', 'error', 'deleted']);
const props = defineProps<{
  headers: any[]
  idField: string
  title: string
  contextId: string
  textCreate?: string
  textEdit?: string
  showIdInTextEdit?: boolean
  iconCreate?: string
  iconEdit?: string
  iconSave?: string
  dialogModelManager: ClassBaseDialog
  classModelManager: {
    model: T
    reset: () => void
    updateModel: (item: T) => void
  }
  serviceFetch: (limit: number, cursor: any) => Promise<any[]>
  serviceSave?: (item: T) => Promise<any>
  serviceDelete?: (id: any) => Promise<void>
  hasActions?: boolean
  hasMoreDetails?: boolean
  selectItems?: boolean
}>();

const adapterFetch = async (limit: number, cursor: any) => {
  return await props.serviceFetch(limit, cursor)
}

const gridManager = new ClassGridDataChart<T>({
  modelTable: { model: { titleTable: props.title } },
});

const confirmDeleteRef = ref<IConfirmDeleteExpose | null>(null);

const gridConfig = gridManager.model
const selectedItem = ref<T | null>(null);

const headersToGraph = computed(() => {
  return (props.headers || [])
    .filter((h) => !h.excludeFromChart && h.key !== 'actions')
    .map((h) => ({ title: h.title, value: h.key }))
});

const selectedChartFilter = ref(headersToGraph.value[0]?.value);
const activeHeaderConfig = computed(() => props.headers.find((h) => h.key === selectedChartFilter.value));

const getChartData = (currentItems: any[]) => {
  return useChartHelpers(
    currentItems,
    selectedChartFilter.value,
    activeHeaderConfig.value?.chartAggregator || 'count',
    stringToColor,
    activeHeaderConfig.value?.chartFormatter,
  )
}

function toggleChartState() {
  gridConfig.modelTable.model.hiddenChart = !gridConfig.modelTable.model.hiddenChart
}

function handleSelection(item: any) {
  hiddenMoreDetails()
  selectedItem.value = item
}

function handleManageRecord(payload: { editingMode: boolean; item?: T }) {
  if (payload.editingMode && payload.item) {
    props.classModelManager.updateModel(payload.item)
    props.dialogModelManager.openEditingMode(payload.item)
  } else {
    props.classModelManager.reset()
    props.dialogModelManager.openNew()
  }
}

function handleDeleteRequest(item: T) {
  if (confirmDeleteRef.value) {
    confirmDeleteRef.value.openDialog(item)
  }
}

function hiddenMoreDetails() {
  selectedItem.value = null
}

</script>
