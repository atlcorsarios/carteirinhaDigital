<template>
  <div class="d-flex align-center">
    <MenuSelectColumns
      v-model:selected-header-keys="selectedHeadersKeys"
      :all-headers="allHeaders"
      :toggle-header="toggleHeader"
    />

    <v-divider
      :thickness="3"
      vertical
      class="mx-2 my-auto"
      style="height: 24px"
    />

    <div class="text-h6 font-weight-bold text-high-emphasis text-truncate">
      {{ t(title) }}
    </div>

    <slot name="actions">
      <v-spacer />

      <template v-if="hasActions">
        <BtnOpenDialog
          icon="mdi-plus-circle"
          v-tooltip="t('tooltips.forms.create')"
          :rotate="true"
          @click="newRegistration"
        />

        <v-divider
          :thickness="3"
          vertical
          class="mx-2 my-auto"
          style="height: 24px"
        />

        <BtnOpenDialog
          icon="mdi-chart-donut-variant"
          v-tooltip="t('tooltips.components.dataTable.graph')"
          :rotate="true"
          @click="toggleChart"
        />
      </template>
    </slot>
  </div>
</template>

<script setup lang="ts">
import MenuSelectColumns from './MenuSelectColumns.vue';
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const selectedHeadersKeys = defineModel<string[]>('selected-header-keys', { required: true });
withDefaults(defineProps<{
  allHeaders: any[]
  title?: string
  hasActions?: boolean
  toggleHeader: (key?: any) => void
  toggleChart: () => void
  newRegistration: () => void
}>(), {
  title: 'messages.components.dataTable.titleDefault'
});

</script>
