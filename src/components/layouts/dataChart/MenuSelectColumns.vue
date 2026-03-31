<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-icon-btn
        v-bind="props"
        icon="mdi-table-cog"
        v-tooltip="t('tooltips.components.dataTable.columnsDataTable')"
        variant="text"
        color="primary"
      />
    </template>

    <v-card
      min-width="250"
      max-height="400"
      class="overflow-y-auto"
    >
      <v-list
        density="compact"
        select-strategy="classic"
        v-model:selected="selectedHeadersKeys"
      >
        <v-list-item
          v-for="header in allHeaders"
          :key="header.key"
          :value="header.key"
        >
          <template v-slot:prepend="{ isActive }">
            <v-list-item-action>
              <v-checkbox-btn
                :model-value="isActive"
                density="compact"
                hide-details
                @click.stop="toggleHeader(header.key)"
              />
            </v-list-item-action>
          </template>
          <v-list-item-title class="text-caption">
            {{ header.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const selectedHeadersKeys = defineModel<string[]>('selected-header-keys', { required: true });

defineProps<{
  allHeaders: any[]
  toggleHeader: (key?: any) => void
}>();

</script>
