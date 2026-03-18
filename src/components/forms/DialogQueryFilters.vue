<template>
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
              v-model:valid="formIsValid"
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
        @click="emit('reset')"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-filter-plus"
        v-tooltip="t('tooltips.forms.add')"
        variant="text"
        color="info"
        :disabled="!formIsValid"
        @click="emit('add-filter')"
      />

      <v-spacer />

      <v-icon-btn
        v-if="tab === 'list'"
        icon="mdi-magnify"
        v-tooltip="t('tooltips.appBar.search')"
        variant="text"
        color="success"
        :disabled="!canSubmit"
        @click="emit('submit')"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../dialog/BaseDialog.vue';
import QueryFilterForm from './QueryFilterForm.vue';
import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter';
import type { IModelBaseDialog } from '@/classes/models/modelComponents/ModelBaseDialog';
import type { ClassQueryFilter } from '@/classes/ClassQueryFilter';
import { useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

const { mdAndDown } = useDisplay()
const { t } = useI18n()

const props = defineProps<{
  titleDialogFilter: string
  canSubmit: boolean
}>()

const dialogAttributes = defineModel<IModelBaseDialog>('attributes', { required: true })
const queryManager = defineModel<ClassQueryFilter>('manager', { required: true })
const tab = defineModel<string>('tab', { default: 'form' })

const emit = defineEmits(['submit', 'reset', 'add-filter'])

const refFormQuery = ref<InstanceType<typeof QueryFilterForm> | null>(null)
const formIsValid = ref(false)

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

defineExpose({
  reset: () => refFormQuery.value?.reset(),
})

</script>
