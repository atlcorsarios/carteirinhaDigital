<template>
  <v-container fluid class="fill-height">
    <grid-data-chart
      :hidden-chart="gridConfig.modelTable.model.hiddenChart"
      @toggle-chart="toggleChartState"
    >
      <template #dataTable>
        <DataTable
          v-model:dataTable="gridConfig.modelTable"
          @item-selecionado="handleSelection"
          @toggle-chart="toggleChartState"
          @gerenciar-registro="handleGerenciarRegistro"
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
</template>

<script lang="ts" setup>
import GridDataChart from '@/components/layouts/GridDataChart.vue';
import DataTable from '@/components/DataTable.vue';
import ChartPie from '@/components/ChartPie.vue';


</script>
