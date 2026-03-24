<template>
  <v-container fluid class="fill-height">
    <GridDataChart
      :hidden-chart="gridConfig.modelTable.model.hiddenChart"
      :selected-item="selectedItem"
      @toggle-chart="toggleChartState"
    >
      <template #dataTable>
        <DataTable
          :id="tableId"
          :selectItems="selectItems"
          :hasActions="hasActions"
          v-model:selected-itens="selectedItens"
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

      <template v-if="selectedItem && hasMoreDetails" #moreDetails>
        <slot name="moreDetails" :item="selectedItem" :close="hiddenMoreDetails" />
      </template>
    </GridDataChart>
  </v-container>

  <BaseDialog v-model:attributes="dialogModelManager.model">
    <template v-slot:title>
      <v-icon
        :icon="
          dialogModelManager.model.formEditingMode
            ? (iconEdit ?? 'mdi-pencil')
            : (iconCreate ?? 'mdi-plus')
        "
        size="small"
        class="mr-2"
      />
      {{
        dialogModelManager.model.formEditingMode
          ? (textEdit || t('tooltips.forms.edit')) +
            ` ${getItemIdentifier(dialogModelManager.model.itemEdition)}`
          : textCreate || t('tooltips.forms.create')
      }}
    </template>

    <template v-slot:default>
      <slot
        name="form"
        :ref-form="(el: any) => refForm = el"
        :model="classModelManager.model"
        :is-valid="isFormValid"
        :update-valid="(val: boolean) => (isFormValid = val)"
        :submit-form="handleSubmit"
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
        :icon="iconSave ?? 'mdi-check'"
        v-tooltip="t('tooltips.forms.save')"
        variant="text"
        color="success"
        :disabled="!isFormValid"
        @click="handleSubmit"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Componentes
import GridDataChart from '@/components/layouts/dataChart/GridDataChart.vue'
import DataTable from '@/components/layouts/dataChart/DataTable.vue'
import ChartPie from '@/components/layouts/dataChart/ChartPie.vue'
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
import { useSnackbar } from '@/composables/useSnackbar'

// Vue
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

const selectedItens = defineModel<any[]>('selected-itens', { required: false })
const emit = defineEmits(['saved', 'error'])
const props = defineProps<{
  headers: any[]
  idField: string
  title: string
  textCreate?: string
  textEdit?: string
  iconCreate?: string
  iconEdit?: string
  iconSave?: string
  dialogModelManager: ClassBaseDialog
  classModelManager: {
    model: T
    reset: () => void
    updateModel: (item: T) => void
  }
  serviceFetch: (offset: number, limit: number) => Promise<IHeaderPaginatorModel<T>>
  serviceSave?: (item: T) => Promise<any>
  hasActions?: boolean
  hasMoreDetails?: boolean
  selectItems?: boolean
}>()

const route = useRoute()
const { notify } = useSnackbar()
const { t } = useI18n()
const { stringToColor } = useStringColor()

const gridManager = new ClassGridDataChart<T>({
  modelTable: { model: { titleTable: props.title } },
})

const gridConfig = gridManager.model

const { limit, offset, total, items, isFinished, loading, tableId, loadMore } = useInfiniteList<T>(
  route.fullPath,
  props.serviceFetch,
)

const paginationModel = computed({
  get: () =>
    ({
      limit: limit.value,
      offset: offset.value,
      total: total.value,
      isFinished: isFinished.value,
    }) as TPagination,
  set: (val: TPagination) => {
    limit.value = val.limit
  },
})

watchEffect(() => {
  gridConfig.modelTable.model.itemsTable = items.value
  gridConfig.modelTable.model.loadingDataTable = loading.value
  gridConfig.modelTable.model.headersTable = props.headers || []
  gridConfig.modelTable.model.titleTable = props.title

  gridConfig.modelChart.optionsFilterSelectData = props.headers?.map((h) => h.title).slice(0, -1) || []
})

function toggleChartState() {
  gridConfig.modelTable.model.hiddenChart = !gridConfig.modelTable.model.hiddenChart
}

const headersToGraph = computed(() => {
  return (props.headers || [])
    .filter((h) => !h.excludeFromChart && h.key !== 'actions')
    .map((h) => ({ title: h.title, value: h.key }))
})

const selectedChartFilter = ref(headersToGraph.value[0]?.value)
const activeHeaderConfig = computed(() =>
  props.headers.find((h) => h.key === selectedChartFilter.value),
)

const chartDataComputed = computed(() => {
  const items = gridConfig.modelTable.model.itemsTable
  return useChartHelpers(
    items,
    selectedChartFilter.value,
    activeHeaderConfig.value?.chartAggregator || 'count',
    stringToColor,
    activeHeaderConfig.value?.chartFormatter,
  )
})

const isFormValid = ref(false)
const refForm = ref<any>(null)
const selectedItem = ref<T | null>(null)

function handleSelection(item: any) {
  hiddenMoreDetails()
  selectedItem.value = item
}

function handleManageRecord(payload: { editingMode: boolean; item?: T }) {
  isFormValid.value = false

  if (payload.editingMode && payload.item) {
    props.classModelManager.updateModel(payload.item)
    props.dialogModelManager.openEditingMode(payload.item)
  } else {
    props.classModelManager.reset()
    props.dialogModelManager.openNew()
  }

  if (refForm.value?.reset) refForm.value.reset()
}

function resetForm() {
  if (refForm.value?.reset) refForm.value.reset()
  if (props.dialogModelManager.model.formEditingMode) {
    const itemEditing = props.dialogModelManager.model.itemEdition
    props.classModelManager.updateModel(itemEditing)
  } else {
    props.classModelManager.reset()
  }
}

async function handleSubmit() {
  if (!isFormValid.value) return

  try {
    if (props.serviceSave) {
      await props.serviceSave(props.classModelManager.model)
    }
    notify('messages.forms.saveSuccess', 'success')
    emit('saved', props.classModelManager.model)
    props.dialogModelManager.toggleDialog()
  } catch (error) {
    notify('messages.forms.saveError', 'error')
    emit('error', error)
  }
}

function getItemIdentifier(item: any) {
  if (!item) return ''
  if (props.idField && item[props.idField]) return item[props.idField]
  const keys = Object.keys(item)
  const idKey = keys.find((k) => k.startsWith('id'))
  return idKey ? item[idKey] : ''
}

function hiddenMoreDetails() {
  selectedItem.value = null
}

</script>
