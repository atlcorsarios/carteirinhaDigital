<template>
  <v-form ref="formRef" v-model="formIsValid" class="search-form w-100" @submit.prevent="handleSubmit">
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
            @click="emit('open-filter')"
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
          @click="emit('submit')"
        />
      </template>
    </v-text-field>
  </v-form>

  <DialogQueryFilters
    ref="refFormQuery"
    v-model:attributes="dialogAttributes"
    v-model:manager="queryManager"
    v-model:tab="tab"
    :title-dialog-filter="titleDialogFilter"
    :can-submit="canSubmit"
    @submit="handleSubmit"
    @add-filter="emit('add-filter')"
    @reset="emit('reset')"
  />
</template>

<script setup lang="ts">
import BtnOpenDialog from '../dialog/BtnOpenDialog.vue'
import DialogQueryFilters from './DialogQueryFilters.vue'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

const { t } = useI18n()

const props = defineProps<{
  loading: boolean
  hasFilters: boolean
  titleDialogFilter: string
}>()

const queryManager = defineModel<ClassQueryFilter>('manager', { required: true })
const dialogAttributes = defineModel<any>('dialogAttributes', { required: true })
const tab = defineModel<string>('tab', { default: 'form' })

const emit = defineEmits(['submit', 'reset', 'add-filter', 'open-filter'])

const formRef = ref<any>(null)
const refFormQuery = ref<InstanceType<typeof DialogQueryFilters> | null>(null)
const inputRef = ref<any>(null)
const formIsValid = ref(false)

const canSubmit = computed(() => {
  const staginModel = queryManager.value.stagingModel.value;
  const hasText = staginModel && staginModel.trim() !== ''
  const hasList = queryManager.value.model.length > 0

  return hasText || hasList
})

const dynamicSearchRules = computed(() => {
  return [
    (value: any) => {
      const hasText = value && value.toString().trim().length > 0
      const hasFilters = queryManager.value.model.length > 0
      return hasText || hasFilters || t('forms.formSearch.validation.required')
    },
  ]
})

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    emit('submit');
  }
}

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
