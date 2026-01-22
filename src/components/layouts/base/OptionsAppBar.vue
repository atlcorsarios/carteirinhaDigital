<template>
  <v-badge v-if="hasNotifications" location="top right" color="warning" dot>
    <v-icon
      icon="mdi-bell"
      v-tooltip="t('tooltips.appBar.notifications')"
      variant="text"
      @click="redirectNotifications"
    />
  </v-badge>

  <v-icon
    v-else
    icon="mdi-bell"
    v-tooltip="t('tooltips.appBar.notifications')"
    variant="text"
    @click="redirectNotifications"
  />

  <v-divider vertical class="mx-2 my-auto" style="height: 24px" :thickness="2" />

  <BtnOpenDialog
    icon="mdi-license"
    v-tooltip="t('tooltips.appBar.licence')"
    :rotate="false"
    @click="toggleDialogLicence"
  />

  <v-divider vertical class="mx-2 my-auto" style="height: 24px" :thickness="2" />

  <v-menu>
    <template v-slot:activator="{ props }">
      <v-icon-btn icon="mdi-translate" v-bind="props" v-tooltip="t('tooltips.appBar.language')" />
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in availableLocales"
        :key="index"
        :value="item.value"
        @click="changeLocale(item.value)"
        :active="locale === item.value"
        color="primary"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-divider vertical class="mx-2 my-auto" style="height: 24px" :thickness="2" />

  <BtnOpenDialog
    :color="isDark ? 'yellow-lighten-3' : 'primary'"
    :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    v-tooltip="t('tooltips.appBar.theme')"
    :rotate="true"
    class="me-3"
    @click="toggleTheme"
  />
</template>

<script lang="ts" setup>
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'
import { availableLocales } from '@/locales/definitionsLocales'
import { StorageUtils } from '@/utils/StorageUtils'
import { useThemeSwitch } from '@/composables/useThemeSwitch'
import router from '@/router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { theme, toggleTheme } = useThemeSwitch()
const isDark = computed(() => theme.global.current.value.dark)
const { t, locale } = useI18n()

function changeLocale(lang: string) {
  locale.value = lang
  StorageUtils.set('user_locale', lang, 'local')
}

const props = defineProps<{
  hasNotifications: boolean
}>()
const emits = defineEmits(['open-dialog-licence'])

function toggleDialogLicence() {
  emits('open-dialog-licence')
}

function redirectNotifications() {
  return router.push({ name: 'Notifications' })
}
</script>
