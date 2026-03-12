<template>
  <v-app-bar app flat border="b">
    <v-app-bar-nav-icon v-tooltip="t('tooltips.appBar.menu')" @click="emits('toggle-drawer')" />
    <v-app-bar-title class="font-weight-bold">{{ t('app.title') }}</v-app-bar-title>

    <template v-if="mdAndUp">
      <v-spacer />
      <div style="width: 100%; max-width: 480px">
        <SearchForm
          ref="refSearchForm"
          v-model:manager="classFormQuery"
          v-model:dialogAttributes="classDialogQueryFilter.model"
          v-model:tab="activeTab"
          :loading="loading"
          :has-filters="hasFilters"
          :title-dialog-filter="titleDialogFilter"
          @submit="handleSearch"
          @reset="handleReset"
          @add-filter="handleAddFilter"
          @open-filter="handleOpenFilter"
        />
      </div>
      <v-spacer />
    </template>

    <template v-slot:extension v-if="!mdAndUp">
      <div class="px-4 pb-2 w-100">
        <SearchForm
          ref="refSearchForm"
          v-model:manager="classFormQuery"
          v-model:dialogAttributes="classDialogQueryFilter.model"
          v-model:tab="activeTab"
          :loading="loading"
          :has-filters="hasFilters"
          :title-dialog-filter="titleDialogFilter"
          @submit="handleSearch"
          @reset="handleReset"
          @add-filter="handleAddFilter"
          @open-filter="handleOpenFilter"
        />
      </div>
    </template>
  </v-app-bar>

  <BaseDialog v-model:attributes="classDialogLicence.model">
    <template v-slot:title>
      <v-icon size="small" icon="mdi-information-variant-circle-outline" />
      {{ t('app.cardInfoLicence') }}
    </template>

    <template v-slot:default>
      <v-list dense>
        <v-list-item
          :title="t('app.version') + ': ' + systemVersion"
          :subtitle="t('app.updateDate') + ': ' + formattedVersionDate"
        >
          <template v-slot:prepend>
            <v-icon size="x-large" color="info" class="mr-3">mdi-code-block-tags</v-icon>
          </template>
        </v-list-item>

        <v-list-item :title="t('app.software')" :subtitle="t('app.title')">
          <template v-slot:prepend>
            <v-icon size="x-large" color="warning" class="mr-3">mdi-license</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import pkg from '../../../../package.json'

// Componentes
import OptionsAppBar from './OptionsAppBar.vue'
import MobileOptionsAppBar from './MobileOptionsAppBar.vue'
import SearchForm from '@/components/forms/SearchForm.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'

// Utils
import { formattedDate } from '@/utils/formattedDate'

// Stores
import { useNotificationsStore } from '@/stores/notificationsStore'

// Composables
import { useSnackbar } from '@/composables/useSnackbar'

// Vue
import { useDisplay, useHotkey } from 'vuetify'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const { mdAndUp } = useDisplay()
const { t, locale } = useI18n()

const route = useRoute()
const { notify } = useSnackbar()

const loading = ref(false)
const systemVersion = pkg.version
const formattedVersionDate = computed(() => {
  return formattedDate(new Date(__APP_BUILD_DATE__), locale.value)
})

const notificationsStore = useNotificationsStore()
const hasUnreadNotifications = ref(false)

onMounted(async () => {
  notificationsStore.fetchNotifications()
  hasUnreadNotifications.value = await notificationsStore.hasUnread()
})

const emits = defineEmits(['toggle-drawer'])

const classFormQuery = new ClassQueryFilter()
const classDialogQueryFilter = new ClassBaseDialog({
  view: false,
  maxHeight: 500,
  maxWidth: 600,
})

const refSearchForm = ref<InstanceType<typeof SearchForm> | null>(null)
const activeTab = ref('form')

const hasFilters = computed(() => !!route.meta?.hasFilters)

const titleDialogFilter = computed(() => {
  const titleKey = route.meta?.title as string | undefined
  return titleKey ? t(titleKey) : ''
})

useHotkey('ctrl+k', () => {
  refSearchForm.value?.focusInput()
})

async function handleOpenFilter() {
  classFormQuery.resetStaging()
  await nextTick()
  classDialogQueryFilter.toggleDialog()
}

async function handleAddFilter() {
  const validFilter = classFormQuery.addFilter()
  if (validFilter) {
    notify('messages.components.queryFilter.addSuccess', 'info')
    classFormQuery.resetStaging()
    await nextTick()
    refSearchForm.value?.reset()
  } else {
    const errorMessage = t('messages.components.queryFilter.alertDuplicate')
    notify(errorMessage, 'warning')
  }
}

async function handleReset() {
  classFormQuery.resetStaging()
  if (activeTab.value === 'form') {
    await nextTick()
    refSearchForm.value?.reset()
  } else {
    classFormQuery.reset()
    activeTab.value = 'form'
  }
}

function handleSearch() {
  const stagingValue = classFormQuery.stagingModel.value
  const hasTextQuery = stagingValue && stagingValue.trim() !== ''
  const hasFilterList = classFormQuery.model.length > 0

  if (!hasTextQuery && !hasFilterList) {
    return
  }

  loading.value = true

  if (classDialogQueryFilter.model.view) {
    classDialogQueryFilter.toggleDialog()
  }

  const filtrosParaEnviar = [...classFormQuery.model]
  if (hasTextQuery) {
    filtrosParaEnviar.push(classFormQuery.stagingModel)
  }

  console.log('Buscando com:', filtrosParaEnviar)

  setTimeout(() => (loading.value = false), 2000)
}

const classDialogLicence = new ClassBaseDialog({
  view: false,
  maxHeight: 350,
  maxWidth: 400,
})

function toggleDialogLicence() {
  classDialogLicence.toggleDialog()
}
</script>

<style scoped>
.search-form {
  max-width: 480px;
  width: 100%;
}
</style>
