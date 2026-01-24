<template>
  <v-card flat border rounded="lg">
    <v-card-title>
      <div class="d-flex align-center">
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

          <v-card min-width="250" max-height="400" class="overflow-y-auto">
            <v-list density="compact" select-strategy="classic" v-model:selected="selectedHeadersKeys">
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

        <v-divider
          vertical
          class="mx-2 my-auto"
          style="height: 24px"
          :thickness="3"
        />

        <div class="text-h6 font-weight-bold text-high-emphasis text-truncate">
          {{ dataTable.model.titleTable || t('messages.components.dataTable.titleDefault') }}
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
              vertical
              class="mx-2 my-auto"
              style="height: 24px"
              :thickness="3"
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
    </v-card-title>

    <v-divider :thickness="3" />

    <v-card-text class="pa-0">
      <v-data-table-virtual
        :id="id"
        :headers="headers"
        :items="dataTable.model.itemsTable"
        :height="dataTable.model.heightTable || 'auto'"
        :max-height="dataTable.model.maxHeightTable || 500"
        :loading="dataTable.model.loadingDataTable"
        :mobile-breakpoint="0"
        :row-props="rowProps"
        fixed-header
        density="compact"
        striped="even"
        hover
        @click:row="clickOnTheLine"
      >
        <template
          v-for="header in headersForSlots"
          :key="header.key"
          v-slot:[`item.${header.key}`]="{ item, value }"
        >
          <div
            class="d-flex align-center h-100"
            :class="[
              header.cellClass ? header.cellClass(getRawValue(item, header.key), item) : '',
              `justify-${header.align || 'start'}`
            ]"
          >
            <v-chip
              v-if="header.dataType === 'boolean'"
              :color="getRawValue(item, header.key) ? 'success' : 'error'"
              variant="outlined"
              size="small"
              class="font-weight-bold"
            >
              {{ header.value ? header.value(item) : (value ? 'Sim' : 'Não') }}
            </v-chip>

            <span v-else>
              {{ header.value ? header.value(item) : value }}
            </span>
          </div>
        </template>

        <template v-if="hasActions" #item.actions="{ item }">
          <div class="d-flex justify-center gap-2">
            <v-icon-btn
              icon="mdi-pencil"
              v-tooltip="t('tooltips.forms.edit')"
              variant="plain"
              color="primary"
              @click="editRegistration(item)"
            />

            <v-icon-btn
              icon="mdi-delete"
              v-tooltip="t('tooltips.forms.delete')"
              variant="plain"
              color="error"
            />
          </div>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5" />
        </template>

        <template v-slot:no-data>
          <div v-if="!dataTable.model.loadingDataTable" class="d-flex flex-column align-center justify-center py-10 text-medium-emphasis">
            <v-icon icon="mdi-database-off" size="48" class="mb-2" />
            <div class="text-body-1">{{ t('messages.components.dataTable.dataNotFound') }}</div>
          </div>
        </template>

        <template v-slot:bottom>
          <v-divider v-intersect="onIntersect" />
          <div class="d-flex align-center justify-space-between pa-2 text-caption">
            <div class="d-flex align-center" style="width: 150px">
              <v-select
                v-model="pagination.limit"
                @update:model-value="updateLimit"
                :items="[10, 20, 50, 100]"
                variant="outlined"
                density="compact"
                hide-details
                class="text-caption"
              />
            </div>
            <div class="text-no-wrap ml-4">
              {{ dataTable.model.itemsTable.length }} / {{ pagination.total }}
            </div>
          </div>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import BtnOpenDialog from "./dialog/BtnOpenDialog.vue";
import type { IModelValueDataTable } from "@/classes/models/modelComponents/ModelGridDataChart";
import type { TPagination } from "@/classes/models/ModelHeaderPaginator";
import { StorageUtils } from "@/utils/StorageUtils";
import { useI18n } from "vue-i18n";
import { ref, computed, watchEffect, watch } from "vue";

const { t } = useI18n()

const dataTable = defineModel<IModelValueDataTable<any>>('dataTable', { required: true });
const pagination = defineModel<TPagination>('pagination', { required: true });


const props = withDefaults(defineProps<{
  id?: string
  hasActions?: boolean
}>(), {
  id: 'id',
  hasActions: true
});

const emits = defineEmits<{
  (e: 'selected-item', item: any): void;
  (e: 'toggle-chart'): void;
  (e: 'manage-record', payload: { editingMode: boolean, item?: any }): void;
  (e: 'load-more'): void;
}>();

const allHeaders = computed(() => {
  const headersAuto = dataTable.value.model.headersTable.map((header) => ({
    ...header,
    title: header.title,
    align: header.align || 'start',
    key: header.key,
    sortable: header.sortable ?? true
  }));

  const headers = headersAuto.filter((header) => {
    if (!props.hasActions) {
      return header.key != 'actions'
    } else {
      return header
    }
  })

  return headers
});

const selectedHeadersKeys = ref<string[]>([]);

watchEffect(() => {
  if (allHeaders.value.length > 0 && selectedHeadersKeys.value.length === 0) {
    selectedHeadersKeys.value = allHeaders.value.map(h => h.key);
  }
});

const headers = computed(() => {
  return allHeaders.value.filter(h => selectedHeadersKeys.value.includes(h.key));
});

const headersForSlots = computed(() => {
  return headers.value.filter(h => h.key !== 'actions');
});

function toggleHeader(key: string) {
  const index = selectedHeadersKeys.value.indexOf(key)

  if (index === -1) {
    selectedHeadersKeys.value.push(key)
  } else {
    selectedHeadersKeys.value.splice(index, 1)
  }
}

const idSelectedItem = ref<any>(null);

const clickOnTheLine = (_event: Event, { item }: any) => {
  const id = item.id || item;
  idSelectedItem.value = id;
  emits('selected-item', item);
}

const rowProps = (data: { item: any }) => {
  const item = data.item
  const isInactive = 'active' in item && item.active === false

  return {
    class: {
      'row-inactive': isInactive,
      'cursor-pointer': true
    }
  }
};

const colorVChipBooleans = (value: boolean) => {
  return value === false ? 'error' : 'success'
};

function getRawValue(item: any, key: string) {
  if (!key || !item) return null
  return key.split('.').reduce((obj, k) => (obj || {})[k], item)
}

function toggleChart() {
  emits('toggle-chart');
}

function newRegistration() {
  emits('manage-record', { editingMode: false });
}

function editRegistration(item: any) {
  emits('manage-record', { editingMode: true, item: item });
}

function onIntersect(isIntersecting: boolean) {
  if (isIntersecting && !pagination.value.isFinished) {
    emits('load-more');
  }
}

function updateLimit(newLimit: number) {
  pagination.value = {
    ...pagination.value,
    limit: newLimit
  };
}

watch(() => pagination.value.limit, (newLimit) => {
  if (newLimit) {
    StorageUtils.set('limit_preference', pagination.value.limit, 'local')
  }
})

</script>

<style scoped>
:deep(.v-field__input) {
  font-size: 0.875rem;
  padding-top: 6px;
  padding-bottom: 6px;
  min-height: 32px;
}

:deep(.row-inactive) {
  opacity: 0.6;
  background-color: rgb(var(--v-theme-surface-variant), 0.1);
  transition: opacity 0.2s;
}

:deep(.row-inactive:hover) {
  opacity: 0.85;
}
</style>
