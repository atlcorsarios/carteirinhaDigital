<template>
  <div class="generic-list-wrapper w-100">
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1 font-weight-bold text-grey-lighten-1">
        <slot name="header"></slot>
      </div>

      <v-select
        v-model="currentLimit"
        :items="limitOptions"
        label="Itens por vez"
        variant="outlined"
        density="compact"
        hide-details
        class="limit-select"
        @update:modelValue="resetAndLoad"
      />
    </div>

    <v-infinite-scroll
      :items="store.items"
      :onLoad="loadMore"
      class="w-100 overflow-hidden"
    >
      <slot :items="store.items"></slot>

      <template v-slot:loading>
        <div class="w-100 d-flex justify-center pa-4">
          <v-progress-circular
            indeterminate
            color="primary"
            size="32"
          />
        </div>
      </template>

      <template v-slot:empty>
        <div class="w-100 text-center text-caption text-grey pa-4">
          <span v-if="store.items.length === 0">
            <v-icon
              icon="mdi-database-off"
              size="48"
              class="mb-2"
            />
            <div class="text-body-1">{{ t('messages.components.dataTable.dataNotFound') }}</div>
          </span>
        </div>
      </template>
    </v-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { useQueryFilterStore } from '@/stores/queryFilterStore';
import { useGenericListStore } from '@/stores/genericListStore'
import { useI18n } from 'vue-i18n';
import { ref, onMounted, watch } from 'vue'

const { t } = useI18n();
const queryFilterStore = useQueryFilterStore();

interface Props {
  contextId: string
  fetchData: (limit: number, cursor: any) => Promise<any[]>
  limitOptions?: number[]
  cursorKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  limitOptions: () => [5, 10, 25, 50, 100],
  cursorKey: 'id'
})

const store = useGenericListStore()
const currentLimit = ref(props.limitOptions[0])

onMounted(() => {
  store.initContext(props.contextId)
})

const loadMore = async ({ done }: any) => {
  if (!store.hasMore) {
    done('empty')
    return
  }

  try {
    const newItems = await props.fetchData(currentLimit.value, store.lastCursor)

    if (newItems.length > 0) {
      const nextCursor = newItems[newItems.length - 1][props.cursorKey]
      const hasNext = newItems.length >= currentLimit.value

      store.addItems(newItems, nextCursor, hasNext)
      done(hasNext ? 'ok' : 'empty')
    } else {
      store.hasMore = false
      done('empty')
    }
  } catch (error) {
    console.error('Erro na paginação:', error)
    done('error')
  }
}

const resetAndLoad = async () => {
  store.resetCurrentContext()
}

watch(() => queryFilterStore.searchTrigger, () => {
  resetAndLoad()
});

</script>

<style scoped>
.limit-select { max-width: 130px; }
</style>
