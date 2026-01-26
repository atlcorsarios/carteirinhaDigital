<template>
  <v-container fluid class="fill-height">
    <GridDataChart
      :hidden-chart="gridConfig.modelTable.model.hiddenChart"
      @toggle-chart="toggleChartState"
    >
      <template #dataTable>
        <DataTable
          :id="tableId"
          v-model:dataTable="gridConfig.modelTable"
          v-model:pagination="paginationModel"
          @selected-item="handleSelection"
          @toggle-chart="toggleChartState"
          @manage-record="handleManageRecord"
          @load-more="loadMore"
        />
      </template>

      <template #dataChart>
        <ChartPie
          v-model:selectedFilter="selectedChartFilter"
          :key="String(gridConfig.modelTable.model.hiddenChart)"
          :chart-data="chartDataComputed"
          :filter-options="headersToGraph"
          :active-config="activeHeaderConfig"
        />
      </template>

      <template v-if="selectedItem" #moreInfo>
        <slot name="moreInfo" :item="selectedItem" />
      </template>
    </GridDataChart>
  </v-container>

  <BaseDialog v-model:attributes="dialogManager.model">
    <template v-slot:title>
      <v-icon
        :icon="dialogManager.model.formEditingMode ? 'mdi-pencil' : 'mdi-plus'"
        size="small"
        class="mr-2"
      />
      {{
        dialogManager.model.formEditingMode
          ? (textEdit || t('tooltips.forms.edit')) + ` ${getItemIdentifier(dialogManager.model.itemEdition)}`
          : (textCreate || t('tooltips.forms.create'))
      }}
    </template>

    <template v-slot:default>
      <slot
        name="form"
        :ref-form="refForm"
        :model="modelManager.model"
        :is-valid="isFormValid"
        :update-valid="(val: boolean) => isFormValid = val"
      />
    </template>

    <template v-slot:actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="resetForm"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-check"
        v-tooltip="t('tooltips.forms.save')"
        variant="text"
        color="success"
        :disabled="!isFormValid"
        @click="submit"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Componentes
import GridDataChart from '@/components/layouts/GridDataChart.vue'
import DataTable from '@/components/DataTable.vue'
import ChartPie from '@/components/ChartPie.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'

// Models
import type { TPagination } from '@/classes/models/ModelHeaderPaginator'
import type { IHeaderPaginatorModel } from '@/classes/models/ModelHeaderPaginator'

// Classes
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Composables
import { useInfiniteList } from '@/composables/useInfiniteList'
import { useChartHelpers } from '@/composables/useChartHelpers'
import { useStringColor } from '@/composables/useStringColor'

// Vue
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

// Definição das Props
const props = defineProps<{
  serviceFetch: (offset: number, limit: number) => Promise<IHeaderPaginatorModel<T>>;
  headers: any[];
  idField?: string;
  title: string;
  textCreate?: string;
  textEdit?: string;
  iconCreate?: string;
  iconEdit?: string;
  iconSave?: string;
  modelManager: {
    model: T;
    reset: () => void;
    updateModel: (item: T) => void;
  };
  serviceSave?: (item: T) => Promise<any>;
}>();

const emit = defineEmits(['saved', 'error']);

const route = useRoute()
const { t } = useI18n()
const { stringToColor } = useStringColor();

// --- Lógica de Grid ---
const gridManager = new ClassGridDataChart<T>({
  modelTable: { model: { titleTable: props.title } }
})
const gridConfig = gridManager.model

const { limit, offset, total, items, isFinished, loading, tableId, loadMore, refresh } = useInfiniteList<T>(
  route.fullPath,
  props.serviceFetch
);

// Sincroniza paginação
const paginationModel = computed({
  get: () => ({ limit: limit.value, offset: offset.value, total: total.value, isFinished: isFinished.value } as TPagination),
  set: (val: TPagination) => { limit.value = val.limit; }
});

// Watchers de configuração da tabela
watchEffect(() => {
  gridConfig.modelTable.model.itemsTable = items.value
  gridConfig.modelTable.model.loadingDataTable = loading.value
  gridConfig.modelTable.model.headersTable = props.headers
  gridConfig.modelTable.model.titleTable = props.title

  gridConfig.modelChart.optionsFilterSelectData = props.headers.map((h) => h.title).slice(0, -1)
})

// --- Lógica de Gráfico ---
function toggleChartState() {
  gridConfig.modelTable.model.hiddenChart = !gridConfig.modelTable.model.hiddenChart
}

const headersToGraph = computed(() => {
  return props.headers
    .filter((h) => !h.excludeFromChart && h.key !== 'actions')
    .map((h) => ({ title: h.title, value: h.key }))
})

const selectedChartFilter = ref(headersToGraph.value[0]?.value)
const activeHeaderConfig = computed(() => props.headers.find((h) => h.key === selectedChartFilter.value))

const chartDataComputed = computed(() => {
  const items = gridConfig.modelTable.model.itemsTable
  return useChartHelpers(
    items,
    selectedChartFilter.value,
    activeHeaderConfig.value?.chartAggregator || 'count',
    stringToColor,
    activeHeaderConfig.value?.chartFormatter
  )
})

// --- Lógica de Dialog e Form ---
const dialogManager = new ClassBaseDialog<T>({ persistent: true, maxWidth: 800 })
const isFormValid = ref(false)
const refForm = ref<any>(null)
const selectedItem = ref<T>()

function handleSelection(item: any) {
  selectedItem.value = item
}

function handleManageRecord(payload: { editingMode: boolean; item?: T }) {
  if (payload.editingMode && payload.item) {
    props.modelManager.updateModel(payload.item)
    dialogManager.openEditingMode(payload.item)
  } else {
    props.modelManager.reset()
    dialogManager.openNew()
  }
  // Tenta resetar validação visual se o form expor o método reset
  if(refForm.value?.reset) refForm.value.reset()
}

function resetForm() {
  if(refForm.value?.reset) refForm.value.reset()
  props.modelManager.reset()
}

async function submit() {
  try {
    if (props.serviceSave) {
        await props.serviceSave(props.modelManager.model);
        // refresh() // Recarregar lista se necessário
    }
    emit('saved', props.modelManager.model);
    dialogManager.toggleDialog()
  } catch (error) {
    emit('error', error);
  }
}

function  getItemIdentifier(item: any) {
    if (!item) return '';
    if (props.idField && item[props.idField]) return item[props.idField];
    const keys = Object.keys(item);
    const idKey = keys.find(k => k.startsWith('id'));
    return idKey ? item[idKey] : '';
}
</script>
