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
    </GridDataChart>
  </v-container>

  <BaseDialog v-model:attributes="classDialogUser.model">
    <template v-slot:title>
      <v-icon
        :icon="classDialogUser.model.formEditingMode ? 'mdi-account-edit' : 'mdi-account-plus'"
        size="small"
        class="mr-2"
      />
      {{
        classDialogUser.model.formEditingMode
          ? t('messages.forms.formUsers.editingUser') +
            ` ${classDialogUser.model.itemEdition?.idUser || ''}`
          : t('messages.forms.formUsers.createUser')
      }}
    </template>

    <template v-slot:default>
      <UserForm
        ref="refFormUser"
        v-model:user="classUser.model"
        v-model:valid="isFormValid"
      />
    </template>

    <template v-slot:actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="resetFormUser"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-account-check"
        v-tooltip="t('tooltips.forms.save')"
        variant="text"
        color="success"
        :disabled="!isFormValid"
        @click="submit"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Componentes
import GridDataChart from '@/components/layouts/GridDataChart.vue'
import DataTable from '@/components/DataTable.vue'
import ChartPie from '@/components/ChartPie.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import UserForm from '@/components/forms/UserForm.vue'

// Classes
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassUsers } from '@/classes/ClassUsers'

// Types
import type { IUser } from '@/classes/models/ModelUser'
import type { TPagination } from '@/classes/models/ModelHeaderPaginator'

// Composables
import { useInfiniteList } from '@/composables/useInfiniteList'
import { useChartHelpers } from '@/composables/useChartHelpers'
import { useStringColor } from '@/composables/useStringColor'

// Services
import { usersServices } from '@/services/resources/usersService'

// Vue
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

const route = useRoute()
const { t } = useI18n()
const { stringToColor } = useStringColor();

const headers = computed(() => ClassUsers.headers)
const optionsChartFilter = computed(() => headers.value.map((h) => h.title).slice(0, -1))

const gridManager = new ClassGridDataChart<IUser>({
  modelTable: {
    model: {
      titleTable: t('dataTable.users.title'),
    }
  }
})

const gridConfig = gridManager.model

const { limit, offset, total, items, isFinished, loading, tableId, loadMore } = useInfiniteList<IUser>(
  route.fullPath,
  usersServices.getAllUsers
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
  gridConfig.modelTable.model.loadingDataTable = loading.value
  gridConfig.modelTable.model.headersTable = headers.value
  gridConfig.modelTable.model.titleTable = t('dataTable.users.title')

  gridConfig.modelChart.optionsFilterSelectData = optionsChartFilter.value
})

function toggleChartState() {
  gridConfig.modelTable.model.hiddenChart = !gridConfig.modelTable.model.hiddenChart
}

const headersToGraph = computed(() => {
  return ClassUsers.headers
    .filter((h) => !h.excludeFromChart && h.key !== 'actions')
    .map((h) => ({ title: h.title, value: h.key }))
})

const selectedChartFilter = ref(headersToGraph.value[0]?.value)

const activeHeaderConfig = computed(() => {
  return headers.value.find((h) => h.key === selectedChartFilter.value)
})

const chartDataComputed = computed(() => {
  const items = gridConfig.modelTable.model.itemsTable
  const key = selectedChartFilter.value
  const strategy = activeHeaderConfig.value?.chartAggregator || 'count'
  const formatter = activeHeaderConfig.value?.chartFormatter
  return useChartHelpers(items, key, strategy, stringToColor, formatter)
})

const classUser = new ClassUsers()
const refFormUser = ref<InstanceType<typeof UserForm> | null>(null)
const isFormValid = ref(false)

const classDialogUser = new ClassBaseDialog<IUser>({
  persistent: true,
  maxWidth: 800,
})

const selectedItem = ref()
function handleSelection(item: any[]) {
  selectedItem.value = item
}

function handleManageRecord(payload: { editingMode: boolean; item?: IUser }) {
  if (payload.editingMode && payload.item) {
    classUser.updateModel(payload.item)
    classDialogUser.openEditingMode(payload.item)
  } else {
    classUser.reset()
    classDialogUser.openNew()
  }
  refFormUser.value?.reset()
}

function resetFormUser() {
  refFormUser.value?.reset()
  classUser.reset()
}

function submit() {
  // Lógica de submit...
  classDialogUser.toggleDialog()
}
</script>
