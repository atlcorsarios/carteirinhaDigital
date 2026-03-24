<template>
  <v-menu
    v-model="open"
    location="bottom end"
    transition="scale-transition"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        icon="mdi-dots-vertical"
        variant="text"
        v-bind="props"
        color="high-emphasis"
      />
    </template>

    <v-list
      nav
      density="comfortable"
      min-width="200"
      elevation="10"
      rounded="lg"
    >
      <v-list-item
        :prepend-icon="hasNotifications ? 'mdi-bell-badge' : 'mdi-bell'"
        :title="t('tooltips.appBar.notifications')"
        :to="{ name: 'Notificações' }"
        link
      >
        <template
          v-if="hasNotifications"
          v-slot:append
        >
          <v-badge
            dot
            inline
            color="warning"
          />
        </template>
      </v-list-item>

      <v-divider class="my-2" />

      <v-list-item
        prepend-icon="mdi-license"
        :title="t('tooltips.appBar.licence')"
        @click="emits('open-dialog-licence')"
      />

      <v-list-item
        :prepend-icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        :title="t('tooltips.appBar.theme')"
        @click="toggleTheme"
      >
        <template v-slot:prepend>
          <BtnOpenDialog
            :color="isDark ? 'yellow-lighten-3' : 'primary'"
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            :rotate="true"
            class="me-3"
          />
        </template>
        <template v-slot:append>
          <v-switch
            :model-value="isDark"
            class="ms-3"
            color="primary"
            density="compact"
            hide-details
            inset
            @click.stop="toggleTheme"
          />
        </template>
      </v-list-item>

      <v-divider class="my-2" />

      <v-list-group value="language">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-translate"
            :title="t('tooltips.appBar.language')"
          />
        </template>

        <v-list-item
          v-for="item in availableLocales"
          :key="item.value"
          :title="item.title"
          :active="locale === item.value"
          @click="changeLocale(item.value)"
          density="compact"
        >
          <template v-slot:append v-if="locale === item.value">
            <v-icon
              icon="mdi-check"
              color="primary"
              size="small"
            />
          </template>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'
import { availableLocales } from '@/locales/definitionsLocales'
import { StorageUtils } from '@/utils/StorageUtils'
import { useThemeSwitch } from '@/composables/useThemeSwitch'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

const { theme, toggleTheme } = useThemeSwitch()
const isDark = computed(() => theme.global.current.value.dark)
const { t, locale } = useI18n()

const open = ref(false)
const props = withDefaults(defineProps<{
  hasNotifications?: boolean
}>(), {
  hasNotifications: false
});

const emits = defineEmits(['open-dialog-licence']);

function changeLocale(lang: string) {
  locale.value = lang
  StorageUtils.set('user_locale', lang, 'local')
}

</script>
