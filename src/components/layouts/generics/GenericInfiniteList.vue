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
        class="limit-select"
        @update:modelValue="resetAndLoad"
      />

      <v-select
        v-model="order"
        :items="['ASC', 'DESC']"
        :label="t('messages.components.infiniteList.order')"
        variant="outlined"
        density="compact"
        hide-details
        class="limit-select"
        @update:modelValue="resetAndLoad"
      />
    </div>

    <v-infinite-scroll
      :items="items"
      :onLoad="loadMore"
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

      <template v-slot:empty>
        <div class="w-100 text-center text-caption text-grey pa-4">
          {{ items.length === 0 ? t('chartPie.noData') : t('chartPie.chartAggregator.count') }}
        </div>
      </template>
    </v-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { useSnackbar } from '@/composables/useSnackbar'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

interface Props {
  fetchData: (limit: number, cursor: any) => Promise<any[]>
  limitOptions?: number[]
  order?: 'ASC' | 'DESC'
  cursorKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  limitOptions: () => [5, 10, 25, 50, 100],
  order: 'ASC',
  cursorKey: 'nome'
})

const { notify } = useSnackbar()
const { t } = useI18n()

const items = ref<any[]>([])
const currentLimit = ref(props.limitOptions[0])
const loading = ref(false)
const hasMore = ref(true)
const lastCursor = ref<any>(null)

const loadMore = async ({ done }: any) => {
  if (!hasMore.value || loading.value) {
    done('empty')
    return
  }

  try {
    loading.value = true
    const newItems = await props.fetchData(currentLimit.value, lastCursor.value)

    if (newItems.length > 0) {
      items.value.push(...newItems)
      lastCursor.value = newItems[newItems.length - 1][props.cursorKey]
    }

    if (newItems.length < currentLimit.value) {
      hasMore.value = false
      done('empty')
    } else {
      done('ok')
    }
  } catch (error) {
    done('error')
    notify(error, 'error')
  } finally {
    loading.value = false
  }
}

const resetAndLoad = async () => {
  items.value = []
  lastCursor.value = null
  hasMore.value = true
}
</script>

<style scoped>
.limit-select {
  max-width: 130px;
}
</style>
