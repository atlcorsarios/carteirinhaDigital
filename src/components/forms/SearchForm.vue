<template>
  <v-form @submit.prevent="emits('submit')" class="search-form w-100">
    <v-text-field
      ref="inputRef"
      v-model="queryManager.stagingModel.value"
      :rules="dynamicSearchRules"
      :label="t('forms.formSearch.search.label')"
      :loading="loading"
      loader-height="2"
      density="compact"
      variant="solo"
      rounded="pill"
      hide-details
      single-line
      clearable
      class="rounded-search w-100"
    >
      <template #prepend-inner>
        <div v-if="hasFilters" class="d-flex flex-row">
          <BtnOpenDialog
            icon="mdi-filter-cog"
            variant="plain"
            v-tooltip="t('tooltips.appBar.filter')"
            :rotate="false"
            @click="openDialog"
          />
          <v-divider
            vertical
            :thickness="2"
            class="mx-1 me-2 my-auto"
            style="height: 24px"
          />
        </div>

        <v-hotkey
          keys="ctrl+k"
          display-mode="icon"
          variant="contained"
          platform="auto"
          class="mr-2"
        />
      </template>

      <template #append-inner>
        <v-icon-btn
          icon="mdi-magnify"
          v-tooltip="t('tooltips.appBar.search')"
          variant="plain"
          :disabled="!canSubmit"
          @click="emits('submit')"
        />
      </template>
    </v-text-field>
  </v-form>

  <BaseDialog v-model:attributes="dialogAttributes">
    <template v-slot:title>
      <div :class="[mdAndDown ? 'd-flex flex-column' : '']">
        <span class="text-h6 me-2">{{ t('messages.components.queryFilter.title') }}</span>
        <span class="text-truncate mr-6 text-subtitle-1 font-weight-bold">
          {{titleDialogFilter}}
        </span>
      </div>
    </template>

    <template v-slot:default>
      <v-tabs color="primary" v-model="tab">
        <v-tab value="form">{{ t('tabs.dialogQueryFilter.form') }}</v-tab>
        <v-tab value="list">{{ t('tabs.dialogQueryFilter.list') }}</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="form">
          <div class="mt-3">
            <QueryFilterForm
              ref="refFormQuery"
              v-model:filter="queryManager.stagingModel"
              v-model:valid="isFormValid"
              :filter-manager="queryManager"
            />
          </div>
        </v-tabs-window-item>

        <v-tabs-window-item value="list">
          <v-list
            v-if="queryManager.model.length > 0"
            rounded
            lines="two"
            density="compact"
            variant="elevated"
            class="bg-transparent"
            style="max-height: 300px; overflow-y: auto;"
          >
            <v-list-item
              v-for="(item, index) in queryManager.model"
              :key="`${item.field}-${index}`"
              :title="formatTitle(item)"
              :subtitle="formatSubtitle(item)"
              class="mb-2"
            >
              <template #prepend>
                <v-avatar
                  color="primary"
                  variant="tonal"
                  size="small"
                >
                  {{ index + 1 }}
                </v-avatar>
              </template>
              <template #append>
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  variant="text"
                  size="small"
                  @click="queryManager.removeFilter(index)"
                />
              </template>
            </v-list-item>
          </v-list>

          <div v-else class="text-center text-medium-emphasis mt-10">
            <v-icon size="40" icon="mdi-filter-off-outline" class="mb-2"/>
          <div>{{ t('filterColumn.none') }}</div> </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>

    <template v-slot:actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="emits('reset')"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-filter-plus"
        v-tooltip="t('tooltips.forms.add')"
        variant="text"
        color="info"
        :disabled="!isFormValid"
        @click="emits('add-filter')"
      />

      <v-spacer />

      <v-icon-btn
        v-if="tab === 'list'"
        icon="mdi-magnify"
        v-tooltip="t('tooltips.appBar.search')"
        variant="text"
        color="success"
        :disabled="!canSubmit"
        @click="emits('submit')"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../dialog/BaseDialog.vue'
import BtnOpenDialog from '../dialog/BtnOpenDialog.vue'
import QueryFilterForm from './QueryFilterForm.vue'
import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

const { mdAndDown } = useDisplay()
const { t } = useI18n()

const props = defineProps<{
  loading: boolean
  hasFilters: boolean
  titleDialogFilter: string
}>()

const queryManager = defineModel<ClassQueryFilter>('manager', { required: true })
const dialogAttributes = defineModel<any>('dialogAttributes', { required: true })
const tab = defineModel<string>('tab', { default: 'form' })

const emits = defineEmits(['submit', 'reset', 'add-filter', 'open-filter'])

const refFormQuery = ref<InstanceType<typeof QueryFilterForm> | null>(null)
const inputRef = ref<any>(null)
const isFormValid = ref(false)

const canSubmit = computed(() => {
  const hasText =
    queryManager.value.stagingModel.value && queryManager.value.stagingModel.value.trim() !== ''
  const hasList = queryManager.value.model.length > 0
  return hasText || hasList
})

function openDialog() {
  emits('open-filter')
}

function formatTitle(item: IQueryFilter) {
  const col = queryManager.value.getColumnType(item.field)
  const label = col ? t(col.label) : item.field

  let conditionLabel = ''
  if (item.condition) {
    conditionLabel = t(`filterColumn.operators.${item.condition}`)
  }

  return `${label} (${conditionLabel})`
}

function formatSubtitle(item: IQueryFilter) {
  if (item.condition === 'between') return `${item.startDate} - ${item.endDate}`
  return item.value
}

const dynamicSearchRules = computed(() => {
  return [
    (value: any) => {
      const hasText = value && value.toString().trim().length > 0
      const hasFilters = queryManager.value.model.length > 0
      return hasText || hasFilters || t('forms.formSearch.validation.required')
    },
  ]
})

defineExpose({
  reset: () => refFormQuery.value?.reset(),
  focusInput: () => inputRef.value?.focus(),
})
</script>

<style scoped>
.rounded-search :deep(.v-field) {
  overflow: hidden;
}
</style>
