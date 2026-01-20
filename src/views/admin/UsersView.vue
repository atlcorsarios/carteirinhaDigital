<template>
  <v-container fluid class="fill-height">
    <grid-data-chart
      :hidden-chart="gridConfig.modelTable.model.hiddenChart"
      @toggle-chart="toggleChartState"
    >
      <template #dataTable>
        <DataTable
          :id="tableId"
          v-model:dataTable="gridConfig.modelTable"
          v-model:pagination="paginationModel"
          @item-selecionado="handleSelection"
          @toggle-chart="toggleChartState"
          @gerenciar-registro="handleGerenciarRegistro"
          @load-more="loadMore"
        />
      </template>

      <template #dataChart>
        <ChartPie
          v-model:selectedFilter="selectedChartFilter"
          :chart-data="chartDataComputed"
          :filter-options="headersParaGrafico"
          :active-config="activeHeaderConfig"
          :key="String(gridConfig.modelTable.model.hiddenChart)"
        />
      </template>
    </grid-data-chart>
  </v-container>

  <BaseDialog v-model:attributes="classDialogUser.dialog">
    <template v-slot:title>
      <v-icon
        size="small"
        class="mr-2"
        :icon="classDialogUser.dialog.formEditingMode ? 'mdi-account-edit' : 'mdi-account-plus'"
      />
      {{
        classDialogUser.dialog.formEditingMode
          ? t('messages.forms.formUsers.editingUser') +
            ` ${classDialogUser.dialog.itemEdition?.idUser || ''}`
          : t('messages.forms.formUsers.createUser')
      }}
    </template>

    <template v-slot:default>
      <UserForm
        ref="refFormUser"
        v-model:user="modelFormUser.user"
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
        icon="mdi-content-save"
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

// Services
import { usersServices } from '@/services/usersService'

// Vue
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'

const route = useRoute()
const { t } = useI18n()

const headers = computed(() => ClassUsers.getHeaders())
const optionsChartFilter = computed(() => headers.value.map((h) => h.title).slice(0, -1))

const gridManager = new ClassGridDataChart<IUser>({
  modelTable: {
    model: {
      titleTable: t('dataTable.users.title'),
    }
  }
})

const gridConfig = gridManager.grid

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

const headersParaGrafico = computed(() => {
  return headers.value
    .filter((h) => h.key !== 'actions')
    .map((h) => ({ title: h.title, value: h.key }))
})

const selectedChartFilter = ref(headersParaGrafico.value[0]?.value)

const activeHeaderConfig = computed(() => {
  return headers.value.find((h) => h.key === selectedChartFilter.value)
})

const chartDataComputed = computed(() => {
  const items = gridConfig.modelTable.model.itemsTable
  const key = selectedChartFilter.value
  const strategy = activeHeaderConfig.value?.chartAggregator || 'count'
  return useChartHelpers(items, key, strategy)
})

const modelFormUser = new ClassUsers()
const refFormUser = ref<InstanceType<typeof UserForm> | null>(null)
const isFormValid = ref(false)

const classDialogUser = new ClassBaseDialog<IUser>({
  persistent: true,
  maxWidth: 800,
})

const itemSelecionado = ref()
function handleSelection(item: any[]) {
  itemSelecionado.value = item
}

function handleGerenciarRegistro(payload: { editingMode: boolean; item?: IUser }) {
  if (payload.editingMode && payload.item) {
    modelFormUser.updateModel({ ...payload.item })
    classDialogUser.openEditingMode(payload.item)
  } else {
    modelFormUser.reset()
    classDialogUser.openNew()
  }
  resetFormUser()
}

function resetFormUser() {
  refFormUser.value?.reset()
  modelFormUser.reset()
}

function submit() {
  // Lógica de submit...
  classDialogUser.toggleDialog()
}
</script>
