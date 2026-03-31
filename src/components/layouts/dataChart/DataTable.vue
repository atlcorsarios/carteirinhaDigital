<template>
  <v-card flat border rounded="lg">
    <v-card-title>
      <HeaderDataTable
        v-model:selected-header-keys="selectedHeadersKeys"
        :all-headers="allHeaders"
        :title="title != null ? title : undefined"
        :has-actions="hasActions"
        :toggle-chart="toggleChart"
        :toggle-header="toggleHeader"
        :new-registration="newRegistration"
      />
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
              @click="emits('delete-item', item)"
            />
          </div>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5" />
        </template>

        <template
          v-if="showEmpty"
          v-slot:no-data
        >
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
import type { IModelValueDataTable } from '@/classes/models/modelComponents/ModelGridDataChart'
import { useI18n } from 'vue-i18n'
import { ref, computed, watchEffect } from 'vue'
import HeaderDataTable from './HeaderDataTable.vue';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    id?: string
    headers: any[]
    items: T[]
    loading?: boolean
    title?: string | null
    hasActions?: boolean
    selectItems?: boolean
    multipleSelect?: boolean
    showEmpty?: boolean
  }>(),
  {
    id: 'id',
    loading: false,
    title: null,
    hasActions: true,
    selectItems: false,
    multipleSelect: true,
    showEmpty: true
  },
);

const dataTable = defineModel<IModelValueDataTable<T>>('dataTable', { required: true });
const selectedItens = defineModel<T[]>('selectedItens', { required: false, default: [{}] });

const emits = defineEmits<{
  (e: 'selected-item', item: T): void
  (e: 'toggle-chart'): void
  (e: 'manage-record', payload: { editingMode: boolean; item?: T }): void
  (e: 'delete-item', item: T): void
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

const rowProps = (data: any) => {
  const item = data.item?.raw || data.item
  const isInactive = item.ativo === false || item.ativo === 'false'
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

<style src="@/assets/components/dataTable.scss" lang="scss" scoped></style>
