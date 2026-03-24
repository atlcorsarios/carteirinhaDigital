<template>
  <div class="generic-list-wrapper w-100">
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1 font-weight-bold text-grey-lighten-1">
        <slot name="header">
          TITLE
        </slot>
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
          <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
        </div>
      </template>

      <template v-slot:empty>
        <div class="w-100 text-center text-caption text-grey pa-4">
          {{ store.items.length === 0 ? 'Nenhum registro encontrado.' : 'Todos os registros carregados.' }}
        </div>
      </template>
    </v-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGenericListStore } from '@/stores/genericListStore' // Ajuste o caminho

interface Props {
  contextId: string // EX: 'lista-parceiros'
  fetchData: (limit: number, cursor: any) => Promise<any[]>
  limitOptions?: number[]
  cursorKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  limitOptions: () => [6, 12, 24, 48],
  cursorKey: 'id'
})

const store = useGenericListStore()
const currentLimit = ref(props.limitOptions[0])

// Assim que o componente nasce, ele avisa a store qual é o contexto dele
onMounted(() => {
  store.initContext(props.contextId)
})

const loadMore = async ({ done }: any) => {
  // Se a store diz que não tem mais, aborta.
  if (!store.hasMore) {
    done('empty')
    return
  }

  try {
    const newItems = await props.fetchData(currentLimit.value, store.lastCursor)

    if (newItems.length > 0) {
      // Pega o cursor do último elemento do array retornado
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
  // Ao limpar a store, o v-infinite-scroll percebe que ficou vazio e chama o loadMore sozinho!
}
</script>

<style scoped>
.limit-select { max-width: 130px; }
</style>

<!-- <template>
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
</style> -->
