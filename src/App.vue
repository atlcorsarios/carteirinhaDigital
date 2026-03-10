<template>
  <v-app>
    <Snackbar />

    <Navigation v-if="isLayoutVisible" v-model="drawerOpen" />
    <AppBar v-if="isLayoutVisible" @toggle-drawer="toggleDrawer" />

    <v-main class="main-scroll position-relative">
      <div v-if="isLayoutVisible" class="app-watermark">
        <img src="/Watermark.jpg" />
      </div>

      <Breadcrumbs v-if="isLayoutVisible" />

      <v-container fluid class="pt-2">
        <BtnFabOtherTemplate v-if="!isLayoutVisible" />
        <RouterView />
      </v-container>
    </v-main>

  </v-app>
</template>

<script setup lang="ts">
import Snackbar from '@/components/Snackbar.vue';
import AppBar from './components/layouts/base/AppBar.vue';
import Navigation from './components/layouts/base/Navigation.vue';
import Breadcrumbs from './components/layouts/base/Breadcrumbs.vue';
import BtnFabOtherTemplate from './components/layouts/BtnFabOtherTemplate.vue';
import { useQuotationStore } from './stores/quotationStore';
import { BASE_CURRENCY, getCurrency } from './locales/definitionsLocales';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed, watch, ref } from 'vue';

const quotationStore = useQuotationStore()
const { t, locale } = useI18n();
const route = useRoute();

watch(
  [() => route.meta.title, locale],
  () => {
    const defaultTitle = t('app.title');
    const routeTitle = route.meta.title as string;

    if (routeTitle) {
      document.title = `${t(routeTitle)} - ${defaultTitle}`;
    } else {
      document.title = defaultTitle;
    }
  }, { immediate: true }
);

watch(locale, (newLocale) => {
  const targetCurrency = getCurrency(newLocale as string)
  if (targetCurrency !== BASE_CURRENCY) {
    quotationStore.ensureRateFor(targetCurrency)
  }
}, { immediate: true })

const isLayoutVisible = computed(() => {
  return route.meta.hidden !== true;
});

const drawerOpen = ref<boolean | null>(null)

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}
</script>

<style global>
html,
v-main {
  margin: 0;
  padding: 0;
}

.main-scroll {
  height: calc(100vh - var(--v-layout-top));
  overflow-y: auto;
  background-color: rgb(var(--v-theme-background));
}

.app-watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  /* z-index: 9999; */
  pointer-events: none;
  user-select: none;
  width: 400px;
  max-width: 80%;

  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.app-watermark img {
  width: 100%;
  height: auto;
  opacity: 0.3;
  mix-blend-mode: multiply;
  transition: all 0.5s ease;
}

.v-theme--dark .app-watermark img {
  opacity: 0.3;
  filter: invert(1) grayscale(100%);
  mix-blend-mode: screen;
}

.z-index-1 {
  z-index: 1;
}
</style>
