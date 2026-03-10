import type { IHeaderPaginatorModel } from '@/classes/models/ModelHeaderPaginator'
import { useListCacheStore } from '@/stores/listCacheStore'
import { StorageUtils } from '@/utils/StorageUtils'
import { onBeforeRouteLeave } from 'vue-router'
import { ref, onMounted, nextTick, watch } from 'vue'

export function useInfiniteList<T>(
  key: string,
  fetchData: (offset: number, limit: number) => Promise<IHeaderPaginatorModel<T>>,
  defaultLimit = 20
) {
  const store = useListCacheStore()

  const userPrefLimit = StorageUtils.get<number>('limit_preference', defaultLimit, 'local');

  const items = ref<T[]>([]) as any
  const offset = ref(0)
  const limit = ref(userPrefLimit)
  const total = ref(0)

  const loading = ref(false)
  const isFinished = ref(false)

  const tableId = `virtual-table-${key.replace(/\W/g, '')}`

  const loadMore = async () => {
    if (loading.value || isFinished.value) return

    loading.value = true
    try {
      const response = await fetchData(offset.value, limit.value)
      const newItems = response.items

      if (response.total !== undefined) {
        total.value = response.total
      }

      if (newItems.length < limit.value || (total.value > 0 && items.value.length + newItems.length >= total.value)) {
        isFinished.value = true
      }

      items.value.push(...newItems)
      offset.value += defaultLimit
    } finally {
      loading.value = false
    }
  }

  const initialize = async () => {
    const cached = store.getSnapshot(key)
    if (cached) {
      items.value = cached.items
      offset.value = cached.nextOffset
      isFinished.value = cached.isFinished

      await nextTick()
      const wrapper = document.querySelector(`#${tableId} .v-table__wrapper`)
      if (wrapper) {
        wrapper.scrollTop = cached.scrollPosition
      }
    } else {
      await loadMore()
    }
  }

  const resetAndReload = async () => {
    items.value = []
    offset.value = 0
    isFinished.value = false
    total.value = 0
    store.clearSnapshot(key)
    await loadMore()
  }

  watch(limit, () => {
    resetAndReload()
  })

  onBeforeRouteLeave(() => {
    const wrapper = document.querySelector(`#${tableId} .v-table__wrapper`)
    store.saveSnapshot(key, {
      items: items.value,
      nextOffset: offset.value,
      isFinished: isFinished.value,
      scrollPosition: wrapper ? wrapper.scrollTop : 0,
    })
  })

  onMounted(initialize)

  return {
    limit,
    offset,
    total,
    items,
    isFinished,
    loading,
    tableId,
    loadMore
  }
}
