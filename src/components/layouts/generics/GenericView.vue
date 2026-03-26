<template>
  <v-container fluid class="fill-height">
    <GenericInfiniteList
      ref="infiniteListRef"
      :cursor-key="idField"
      :context-id="String(route.name)"
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
              :id="String(route.name)"
              :selectItems="selectItems"
              :hasActions="hasActions"
              :headers="headers"
              :items="items"
              :loading="loading"
              v-model:selected-itens="selectedItens"
              v-model:dataTable="gridConfig.modelTable"
              @selected-item="handleSelection"
              @toggle-chart="toggleChartState"
              @manage-record="handleManageRecord"
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
import GenericInfiniteList from './GenericInfiniteList.vue'
import GridDataChart from '@/components/layouts/dataChart/GridDataChart.vue'
import DataTable from '@/components/layouts/dataChart/DataTable.vue'
import ChartPie from '@/components/layouts/dataChart/ChartPie.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'

// Classes
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Stores
import { useGenericListStore } from '@/stores/genericListStore'

// Composables
import { useChartHelpers } from '@/composables/useChartHelpers'
import { useStringColor } from '@/composables/useStringColor'
import { useSnackbar } from '@/composables/useSnackbar'

// Vue
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

const { notify } = useSnackbar();
const { t } = useI18n();
const { stringToColor } = useStringColor();

const route = useRoute();
const listStore = useGenericListStore();

const selectedItens = defineModel<any[]>('selected-itens', { required: false });
const emit = defineEmits(['saved', 'error']);
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
  serviceFetch: (limit: number, cursor: any) => Promise<any[]>
  serviceSave?: (item: T) => Promise<any>
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

const gridConfig = gridManager.model

function toggleChartState() {
  gridConfig.modelTable.model.hiddenChart = !gridConfig.modelTable.model.hiddenChart
}

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

const isFormValid = ref(false);
const refForm = ref<any>(null);
const selectedItem = ref<T | null>(null);

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
    let itemSalvo = props.classModelManager.model

    if (props.serviceSave) {
      const response = await props.serviceSave(props.classModelManager.model)
      if (response) itemSalvo = response
    }

    notify('messages.forms.saveSuccess', 'success');
    emit('saved', itemSalvo);
    props.dialogModelManager.toggleDialog();

    if (props.dialogModelManager.model.formEditingMode) {
      const index = listStore.items.findIndex((item) =>
        item[props.idField] === itemSalvo[props.idField]
      )

      if (index !== -1) {
        listStore.items[index] = { ...listStore.items[index], ...itemSalvo }
      }
    } else {
      listStore.items.push(itemSalvo);
    }

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
