<template>
  <v-app-bar app flat border="b">
    <v-app-bar-nav-icon v-tooltip="t('tooltips.appBar.menu')" @click="emits('toggle-drawer')" />
    <v-app-bar-title class="font-weight-bold">{{ t('app.title') }}</v-app-bar-title>

    <template v-if="mdAndUp">
      <v-spacer />
      <div style="width: 100%; max-width: 480px">
        <AppBarSearchForm :loading="loading" @search="handleSearch" />
      </div>
      <v-spacer />
    </template>

    <template v-slot:extension v-if="!mdAndUp">
      <div class="px-4 pb-2 w-100">
        <AppBarSearchForm :loading="loading" @search="handleSearch" />
      </div>
    </template>

    <template v-slot:append>
      <div v-if="mdAndUp" class="d-flex flex-row align-center">
        <OptionsAppBar
          :has-notifications="hasUnreadNotifications"
          @open-dialog-licence="toggleDialogLicence"
        />
      </div>
      <div v-else>
        <MobileOptionsAppBar
          :has-notifications="hasUnreadNotifications"
          @open-dialog-licence="toggleDialogLicence"
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

        <v-list-item
          :title="t('app.software')"
          :subtitle="t('app.title')"
        >
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
import OptionsAppBar from './OptionsAppBar.vue'
import MobileOptionsAppBar from './MobileOptionsAppBar.vue'
import AppBarSearchForm from '@/components/forms/AppBarSearchForm.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { formattedDate } from '@/utils/formattedDate'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { ref, computed, onMounted } from 'vue'

const { mdAndUp } = useDisplay()
const { t, locale } = useI18n()
const notificationsStore = useNotificationsStore()
const hasUnreadNotifications = ref(false)
const loading = ref(false)
const systemVersion = pkg.version
const formattedVersionDate = computed(() => {
  return formattedDate(new Date(__APP_BUILD_DATE__), locale.value);
})

onMounted(async () => {
  notificationsStore.fetchNotifications();
  hasUnreadNotifications.value = await notificationsStore.hasUnread();
});

const emits = defineEmits(['toggle-drawer'])

function handleSearch(term: string) {
  loading.value = true
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
