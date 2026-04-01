<template>
  <v-app-bar app flat border="b">
    <v-app-bar-nav-icon v-tooltip="t('tooltips.appBar.menu')" @click="emits('toggle-drawer')" />
    <v-app-bar-title class="font-weight-bold">
      <div class="d-flex align-center justify-space-between">
        {{ t('app.title') }}
        <MobileOptionsAppBar
          v-if="!mdAndUp"
          @open-dialog-licence="toggleDialogLicence"
        />
      </div>
    </v-app-bar-title>

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

      <OptionsAppBar @open-dialog-licence="toggleDialogLicence" />
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

  <DialogLicense v-model:attributes="classDialogLicence" />
</template>

<script setup lang="ts">
// Componentes
import OptionsAppBar from './OptionsAppBar.vue'
import MobileOptionsAppBar from './MobileOptionsAppBar.vue'
import SearchForm from '@/components/forms/SearchForm.vue'
import DialogLicense from '@/components/dialog/DialogLicense.vue'

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'

// Stores
import { useNotificationsStore } from '@/stores/notificationsStore'
import { useQueryFilterStore } from '@/stores/queryFilterStore'

// Composables
import { useSnackbar } from '@/composables/useSnackbar'

// Vue
import { useDisplay, useHotkey } from 'vuetify'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const { t } = useI18n();
const { notify } = useSnackbar();
const { mdAndUp } = useDisplay();
const route = useRoute();
const notificationsStore = useNotificationsStore();
const queryFilterStore = useQueryFilterStore();

const hasUnreadNotifications = ref(false);
const loading = ref(false);

const classFormQuery = new ClassQueryFilter();
const classDialogQueryFilter = new ClassBaseDialog({
  view: false,
  maxHeight: 500,
  maxWidth: 600,
});

const classDialogLicence = new ClassBaseDialog({
  view: false,
  maxHeight: 350,
  maxWidth: 400,
});

const refSearchForm = ref<InstanceType<typeof SearchForm> | null>(null);
const activeTab = ref('form');

const hasFilters = computed(() => !!route.meta?.hasFilters);

const titleDialogFilter = computed(() => {
  const titleKey = route.meta?.title as string | undefined
  return titleKey ? t(titleKey) : ''
});

watch(() => route.path, () => {
  queryFilterStore.clearFilters()
  classFormQuery.reset()
  if (refSearchForm.value) {
    refSearchForm.value.reset()
  }
});

useHotkey('ctrl+k', () => {
  refSearchForm.value?.focusInput()
});

const emits = defineEmits(['toggle-drawer']);

// onMounted(async () => {
//   notificationsStore.fetchNotifications()
//   hasUnreadNotifications.value = await notificationsStore.hasUnread()
// });

function toggleDialogLicence() {
  classDialogLicence.toggleDialog()
}

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

  if (classDialogQueryFilter.model.view) {
    classDialogQueryFilter.toggleDialog()
  }

  const filtrosParaEnviar = [...classFormQuery.model]
  if (hasTextQuery) {
    filtrosParaEnviar.push(classFormQuery.stagingModel)
  }

  queryFilterStore.setFilters(filtrosParaEnviar)
}
</script>

<style scoped>
.search-form {
  max-width: 480px;
  width: 100%;
}
</style>
