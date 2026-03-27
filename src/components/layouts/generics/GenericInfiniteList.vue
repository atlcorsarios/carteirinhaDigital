<template>
  <div class="generic-list-wrapper w-100">
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1 font-weight-bold text-grey-lighten-1">
        <slot name="header"></slot>
      </div>

      <v-select
        v-model="currentLimit"
        :items="limitOptions"
        :label="t('messages.components.infiniteList.limit')"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 130px;"
        @update:modelValue="resetAndLoad"
      />
    </div>

    <v-infinite-scroll
      :items="items"
      :onLoad="loadMore"
      :empty-text="emptyText"
      class="w-100 overflow-hidden"
    >
      <slot
        :items="items"
        :loading="loading"
      ></slot>

      <template v-slot:loading>
        <div class="w-100 d-flex justify-center pa-4">
          <v-progress-circular
            indeterminate
            color="primary"
            size="32"
          />
        </div>
      </template>

      <template
        v-if="showEmpty"
        v-slot:empty
      >
        <div class="w-100 text-center text-caption text-grey pa-4">
          <div
            v-if="items.length === 0"
            class="d-flex flex-column align-center"
          >
            <v-icon
              icon="mdi-database-off"
              size="48"
              class="mb-2"
            />
            <div class="text-body-1">{{ t('messages.components.dataTable.dataNotFound') }}</div>
          </div>

          <div v-else class="mt-4">
            <v-divider class="mb-2" />
            <span>{{ t('messages.components.infiniteList.totais') }}</span>
          </div>
        </div>
      </template>
    </v-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { useQueryFilterStore } from '@/stores/queryFilterStore';
import { useGenericListStore } from '@/stores/genericListStore'
import { useI18n } from 'vue-i18n';
import { ref, onMounted, watch, computed } from 'vue'

const { t } = useI18n();
const queryFilterStore = useQueryFilterStore();
const store = useGenericListStore();

const loading = ref<boolean>(false);

interface Props {
  contextId: string
  fetchData: (limit: number, cursor: any) => Promise<any[]>
  limitOptions?: number[]
  cursorKey?: string
  showEmpty?: boolean
  emptyText?: string
  listenGlobalFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  limitOptions: () => [5, 10, 25, 50, 100],
  cursorKey: 'id',
  showEmpty: true,
  emptyText: '',
  listenGlobalFilters: true
});

const items = computed(() => store.getItems(props.contextId));
const hasMore = computed(() => store.getHasMore(props.contextId));
const lastCursor = computed(() => store.getLastCursor(props.contextId));

const currentLimit = ref(props.limitOptions[0]);

const resetAndLoad = async () => {
  store.resetContext(props.contextId)
}

const loadMore = async ({ done }: any) => {
  if (!hasMore.value) {
    done('empty')
    return
  }

  loading.value = true

  try {
    const newItems = await props.fetchData(currentLimit.value, lastCursor.value)

    if (newItems.length > 0) {
      const nextCursor = newItems[newItems.length - 1][props.cursorKey]
      const nextHasMore = newItems.length >= currentLimit.value

      store.addItems(props.contextId, newItems, nextCursor, nextHasMore)
      done(nextHasMore ? 'ok' : 'empty')
    } else {
      store.resetContext(props.contextId)
      store.addItems(props.contextId, [], null, false)
      done('empty')
    }
  } catch (error) {
    done('error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  store.initContext(props.contextId);
});

watch(() => queryFilterStore.searchTrigger, () => {
  if (props.listenGlobalFilters) {
    resetAndLoad()
  }
});

defineExpose({
  resetAndLoad
});

</script>
