<template>
  <GridDataChart
    :hidden-chart="gridConfig.modelTable.model.hiddenChart"
    @toggle-chart="toggleChartState"
  >
    <template v-slot:dataTable>
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

    <template v-slot:dataChart>
      <ChartPie
        v-model:selectedFilter="selectedChartFilter"
        :key="String(gridConfig.modelTable.model.hiddenChart)"
        :chartData="chartDataComputed"
        :filterOptions="headersToGraph"
        :activeConfig="activeHeaderConfig"
      />
    </template>

    <template v-if="selectedItem" v-slot:moreInfo>
      <ProductsMoreInfo v-model:product="selectedItem"/>
    </template>
  </GridDataChart>

  <BaseDialog v-model:attributes="classDialogProduct.model">
    <template v-slot:title>
      <v-icon
        size="small"
        class="mr-2"
        :icon="classDialogProduct.model.formEditingMode
          ? 'mdi-pencil-outline'
          : 'mdi-package-variant-closed-plus'"
      />
      {{
        classDialogProduct.model.formEditingMode
          ? t('messages.forms.formProduct.editingProduct') +
            ` ${classDialogProduct.model.itemEdition?.idProduct || ''}`
          : t('messages.forms.formProduct.createProduct')
      }}
    </template>

    <template v-slot:default>
      <ProductForm
        ref="refFormProduct"
        v-model:product="classProduct.model"
        v-model:valid="isFormValid"
      />
    </template>

    <template v-slot:actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="resetFormProduct"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-package-variant-closed-check"
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
import GridDataChart from '@/components/layouts/GridDataChart.vue';
import DataTable from '@/components/DataTable.vue';
import ChartPie from '@/components/ChartPie.vue';
import BaseDialog from '@/components/dialog/BaseDialog.vue';
import ProductForm from '@/components/forms/products/ProductForm.vue';

// Models
import type { IProduct } from '@/classes/models/ModelIProduct';
import type { TPagination } from '@/classes/models/ModelHeaderPaginator';

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';
import { ClassProducts } from '@/classes/products/ClassProducts';
import { ClassGridDataChart } from '@/classes/ClassGridDataChart';

// Service
import { productsServices } from '@/services/resources/products/productsService';

// Composables
import { useInfiniteList } from '@/composables/useInfiniteList';
import { useChartHelpers } from '@/composables/useChartHelpers';
import { useStringColor } from '@/composables/useStringColor'

// Vue
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { computed, ref, watchEffect } from 'vue';
import ProductsMoreInfo from './ProductsMoreInfo.vue';

const route = useRoute()
const { t } = useI18n()
const { stringToColor } = useStringColor();

const headers = computed(() => ClassProducts.headers)
const optionsChartFilter = computed(() => headers.value.map((h) => h.title).slice(0, -1))

const gridManager = new ClassGridDataChart<IProduct>({
  modelTable: {
    model: {
      titleTable: t('dataTable.products.title'),
    }
  }
})

const gridConfig = gridManager.model

const { limit, offset, total, items, isFinished, loading, tableId, loadMore } = useInfiniteList<IProduct>(
  route.fullPath,
  productsServices.getAllProducts
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
  gridConfig.modelTable.model.titleTable = t('dataTable.products.title')

  gridConfig.modelChart.optionsFilterSelectData = optionsChartFilter.value
})

function toggleChartState() {
  gridConfig.modelTable.model.hiddenChart = !gridConfig.modelTable.model.hiddenChart
}

const headersToGraph = computed(() => {
  return ClassProducts.headers
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

const classProduct = new ClassProducts()
const refFormProduct = ref<InstanceType<typeof ProductForm> | null>(null)
const isFormValid = ref(false)


const classDialogProduct = new ClassBaseDialog<IProduct>({
  persistent: true,
  maxWidth: 1000,
  maxHeight: 600
})

const selectedItem = ref()
function handleSelection(item: any[]) {
  selectedItem.value = item
}

function handleManageRecord(payload: { editingMode: boolean; item?: IProduct }) {
  if (payload.editingMode && payload.item) {
    classProduct.updateModel(payload.item)
    classDialogProduct.openEditingMode(payload.item)
  } else {
    classProduct.reset()
    classDialogProduct.openNew()
  }
  refFormProduct.value?.reset()
}

function resetFormProduct() {
  refFormProduct.value?.reset()
  classProduct.reset()
}

function submit() {
  // Lógica de submit...
  classDialogProduct.toggleDialog()
}
</script>
