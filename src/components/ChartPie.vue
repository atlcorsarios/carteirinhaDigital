<template>
  <div class="d-flex justify-center">
    <v-card class="pa-6" elevation="6" rounded="xl" width="100%">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-truncate mr-6 text-subtitle-1 font-weight-bold">
          {{ titleGraph }}
        </div>
        <v-select
          v-model="selectedFilter"
          :items="filterOptions"
          item-title="title"
          item-value="value"
          density="compact"
          label="Agrupar por"
          max-width="200"
          variant="solo-filled"
          flat
          hide-details
          single-line
        />
      </v-card-title>

      <div v-if="chartData.length > 0">
        <v-pie
          :key="selectedFilter"
          :items="chartData"
          :legend="{ position: mdAndUp ? 'right' : 'bottom' }"
          class="pa-3 mt-3 justify-center"
          gap="2"
          hover-scale=".1"
          inner-cut="70"
          item-key="key"
          rounded="2"
          :size="mdAndUp ? 300 : '100%'"
          tooltip
          animation
          hide-slice
          reveal
        >
          <template v-slot:center>
            <div class="text-center">
              <div class="text-h6 font-weight-bold">{{ formatValue(totalValue) }}</div>
              <div class="opacity-70 text-caption text-medium-emphasis mt-1 mb-n1">
                {{ labelCenter }}
              </div>
            </div>
          </template>

          <template v-slot:legend="{ items, toggle, isActive }">
            <v-list class="py-0 mb-n5 mb-md-0 bg-transparent" density="compact" width="300">
              <v-list-item
                v-for="item in items"
                :key="item.key"
                :class="['my-1', { 'opacity-40': !isActive(item) }]"
                :title="formatValue(item.title)"
                rounded="lg"
                link
                @click="toggle(item)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="item.color" :size="16" class="mr-2" />
                </template>

                <template v-slot:append>
                  <div class="font-weight-black text-caption">
                    {{ calculatePercentage(item.value) }}%
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </template>

          <template v-slot:tooltip="{ item }">
            {{ item.title }}: {{ formatValue(item.value) }}x ({{ calculatePercentage(item.value) }}%)
          </template>
        </v-pie>
      </div>

      <div v-else class="d-flex flex-column align-center justify-center py-10 opacity-60">
        <v-icon icon="mdi-chart-pie-off" size="40" class="mb-2" />
        <span class="text-caption">{{ t('chartPie.noData') }}</span>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { ValueDataChart } from '@/classes/models/modelComponents/ModelGridDataChart'
import type { IHeadersDataTable } from '@/classes/models/modelComponents/ModelHeaderTable'
import { useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { mdAndUp } = useDisplay();
const { t } = useI18n();

const props = defineProps<{
  chartData: ValueDataChart[]
  filterOptions: { title: string; value: string }[]
  activeConfig?: IHeadersDataTable
}>()

const selectedFilter = defineModel<string>('selectedFilter', { required: true })

const labelCenter = computed(() => {
  return props.activeConfig?.chartAggregator === 'sum' ? `${t('chartPie.chartAggregator.sum')}` : `${t('chartPie.chartAggregator.count')}`
})

const titleGraph = computed(() => {
  return `${t('chartPie.title')}: ${props.activeConfig?.title.toLocaleLowerCase() || '?'}`
})

const totalValue = computed(() => {
  return props.chartData.reduce((acc, curr) => acc + curr.value, 0)
})

function formatValue(value: any) {
  if (props.activeConfig?.chartFormatter) {
    return props.activeConfig.chartFormatter(value)
  }
  return value.toLocaleString()
}

function calculatePercentage(val: number) {
  if (!totalValue.value) {
    return 0
  }
  return ((val / totalValue.value) * 100).toFixed(1)
}

</script>
