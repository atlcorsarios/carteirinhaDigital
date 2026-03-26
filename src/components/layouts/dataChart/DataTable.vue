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

        <v-divider
          :thickness="3"
          vertical
          class="mx-2 my-auto"
          style="height: 24px"
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
    </v-card-title>

    <v-divider :thickness="3" />

    <v-card-text class="pa-0">
      <v-data-table-virtual
        v-model="selectedItens"
        :strategy="multipleSelect ? 'multiple' : 'single'"
        :return-object="selectItems"
        :show-select="selectItems"
        :id="id"
        :headers="headers"
        :items="items"
        :height="dataTable.model.heightTable || 'auto'"
        :max-height="dataTable.model.maxHeightTable || 500"
        :loading="loading"
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
            class="d-flex align-center h-100 w-100"
            :class="[
              header.cellClass ? header.cellClass(getRawValue(item, header.key), item) : '',
              `justify-${header.align || 'start'}`,
            ]"
          >
            <v-chip
              v-if="header.dataType === 'boolean'"
              :color="getRawValue(item, header.key) ? 'success' : 'error'"
              variant="outlined"
              size="small"
              class="font-weight-bold"
            >
              {{ header.value ? header.value(item) : value ? t('messages.yes') : t('messages.no') }}
            </v-chip>

            <span v-else :class="{ 'text-truncate': !!header.maxWidth }">
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
          <div
            v-if="!loading"
            class="d-flex flex-column align-center justify-center py-10 text-medium-emphasis"
          >
            <v-icon
              icon="mdi-database-off"
              size="48"
              class="mb-2"
            />
            <div class="text-body-1">{{ t('messages.components.dataTable.dataNotFound') }}</div>
          </div>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'
import type { IModelValueDataTable } from '@/classes/models/modelComponents/ModelGridDataChart'
import { useI18n } from 'vue-i18n'
import { ref, computed, watchEffect } from 'vue'

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    id?: string
    headers: any[]
    items: T[]
    loading?: boolean
    title?: string
    hasActions?: boolean
    selectItems?: boolean
    multipleSelect?: boolean
  }>(),
  {
    id: 'id',
    loading: false,
    title: '',
    hasActions: true,
    selectItems: false,
    multipleSelect: true,
  },
);

const dataTable = defineModel<IModelValueDataTable<T>>('dataTable', { required: true });
const selectedItens = defineModel<T[]>('selectedItens', { required: false, default: [{}] });

const emits = defineEmits<{
  (e: 'selected-item', item: T): void
  (e: 'toggle-chart'): void
  (e: 'manage-record', payload: { editingMode: boolean; item?: T }): void
}>();

const allHeaders = computed(() => {
  const headersAuto = props.headers.map((header) => ({
    ...header,
    title: header.title,
    align: header.align || 'start',
    key: header.key,
    sortable: header.sortable ?? true,
  }))

  return headersAuto.filter((header) => {
    if (!props.hasActions) return header.key != 'actions'
    return true
  })
});

const selectedHeadersKeys = ref<string[]>([]);

const headers = computed(() => {
  return allHeaders.value.filter((h) => h.key && selectedHeadersKeys.value.includes(h.key))
});

const headersForSlots = computed(() => {
  return headers.value.filter((h) => h.key !== 'actions')
});

function toggleHeader(key?: string) {
  if (!key) return
  const index = selectedHeadersKeys.value.indexOf(key)

  if (index === -1) {
    selectedHeadersKeys.value.push(key)
  } else {
    selectedHeadersKeys.value.splice(index, 1)
  }
}

const clickOnTheLine = (_event: Event, { item }: T) => {
  const id = item.id || item
  const index = selectedItens.value.indexOf(id)
  if (index > -1) {
    selectedItens.value.splice(index, 1)
  } else {
    selectedItens.value.push(item)
  }
  emits('selected-item', item)
}

const rowProps = (data: { item: T }) => {
  const item = data.item
  const isInactive = 'active' in item && item.active === false
  const isViewed = 'seen' in item && item.seen === true

  return {
    class: {
      'row-inactive': isInactive,
      'row-viewed': isViewed,
      'cursor-pointer': true,
    },
  }
}

function getRawValue(item: T, key?: string) {
  if (!key || !item) return null
  return key.split('.').reduce((obj, k) => (obj || {})[k], item)
}

function toggleChart() {
  emits('toggle-chart')
}

function newRegistration() {
  emits('manage-record', { editingMode: false })
}

function editRegistration(item: T) {
  emits('manage-record', { editingMode: true, item: item })
}

watchEffect(() => {
  if (allHeaders.value.length > 0 && selectedHeadersKeys.value.length === 0) {
    selectedHeadersKeys.value = allHeaders.value
      .map((h) => h.key)
      .filter((key): key is string => key !== undefined)
  }
});
</script>

<style scoped>
:deep(.v-field__input) {
  font-size: 0.875rem;
  padding-top: 6px;
  padding-bottom: 6px;
  min-height: 32px;
}

:deep(.row-inactive) {
  opacity: 0.3;
  background-color: rgb(var(--v-theme-surface-variant), 0.1);
  transition: opacity 0.2s;
}

:deep(.row-inactive:hover) {
  opacity: 0.85;
}

:deep(.row-viewed) {
  opacity: 0.4;
  transition: all 0.3s ease;
  background-color: transparent;
  border: 1px solid rgb(var(--v-theme-success), 0.4);
  border-radius: 12px;
  outline: 1px solid rgb(var(--v-theme-success), 0.4);
  outline-offset: -1px;
  border-collapse: separate;
}

:deep(.row-viewed:hover) {
  opacity: 1;
  outline-color: rgba(76, 175, 80, 0.9);
}
</style>
