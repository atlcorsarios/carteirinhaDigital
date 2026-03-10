<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    :expand-on-hover="mdAndUp"
    :rail="mdAndUp"
    class="main-drawer"
  >
    <template v-slot:prepend>
      <v-list nav>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="authStore.user?.username"
          :subtitle="authStore.user?.email"
        />
      </v-list>
    </template>

    <v-divider />

    <v-list density="compact" nav>
      <template v-for="item in menuItems" :key="item.path">
        <v-list-group v-if="item.children && item.children.length > 0" :value="item.name">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="item.icon"
              :title="t(item.title || '')"
              v-tooltip="t(item.title || '')"
            />
          </template>

          <v-list-item
            v-for="child in item.children"
            :key="child.path"
            :prepend-icon="child.icon"
            :title="t(child.title || '')"
            :to="{ name: child.name }"
            exact
            v-tooltip="t(child.title || '')"
            class="child-item"
          >
            <template v-slot:append v-if="item.hotkey && mdAndUp">
              <v-hotkey
                :keys="child.hotkey"
                display-mode="icon"
                variant="contained"
                platform="auto"
                style="transform: scale(0.75)"
              />
            </template>
          </v-list-item>
        </v-list-group>

        <v-list-item
          v-else
          :prepend-icon="getDynamicIcon(item)"
          :title="t(item.title || '')"
          :to="{ name: item.name }"
          exact
          v-tooltip="t(item.title || '')"
        >
          <template v-slot:append v-if="item.hotkey && mdAndUp">
            <v-hotkey
              :keys="item.hotkey"
              display-mode="icon"
              variant="contained"
              platform="auto"
              style="transform: scale(0.75)"
            />
          </template>
        </v-list-item>
      </template>
    </v-list>

    <template v-slot:append>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-logout"
          :title="t('routes.logout')"
          :to="{ name: 'Login' }"
          exact
          @click="handleLogout"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useNavigation } from '@/composables/useNavigation'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { useHotkey, useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'

const { mdAndUp } = useDisplay()
const { menuItems } = useNavigation()
const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()
const notificationsStore = useNotificationsStore()
const hasUnreadNotifications = ref(false);

onMounted(async () => {
  notificationsStore.fetchNotifications();
  hasUnreadNotifications.value = await notificationsStore.hasUnread();
});

const props = defineProps<{
  modelValue: boolean | null
}>()

const emits = defineEmits(['update:modelValue'])

const drawer = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})

const flattenMenuItems = (items: typeof menuItems.value): any[] => {
  return items.reduce((acc: any[], item) => {
    acc.push(item)
    if (item.children && item.children.length > 0) {
      acc.push(...flattenMenuItems(item.children))
    }
    return acc
  }, [])
}

const allItems = flattenMenuItems(menuItems.value)

allItems.forEach((item) => {
  if (item.hotkey && item.name) {
    useHotkey(item.hotkey, () => {
      router.push({ name: item.name })
    })
  }
})

function getDynamicIcon(item: any): string {
  if (item.name === 'Notifications' && hasUnreadNotifications.value) {
    return 'mdi-bell-badge';
  }

  return item.icon;
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}

</script>

<style scoped lang="scss">
:deep(.v-navigation-drawer--rail) {
  .v-list-group {
    --v-list-group-items-indent: 0px;
  }

  .hotkey-wrapper {
    display: none !important;
  }

  .v-list-item__prepend {
    display: block;
  }
}

.child-item {
  padding-inline-start: 8px !important;
}

:deep(.v-navigation-drawer--rail) .child-item {
  padding-inline-start: 0px !important;
}
</style>
