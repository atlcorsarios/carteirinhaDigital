import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGenericListStore = defineStore('genericList', () => {
  const context = ref<string | null>(null)
  const items = ref<any[]>([])
  const lastCursor = ref<any>(null)
  const hasMore = ref(true)

  function initContext(newContext: string) {
    if (context.value !== newContext) {
      context.value = newContext
      items.value = []
      lastCursor.value = null
      hasMore.value = true
    }
  }

  function addItems(newItems: any[], cursor: any, more: boolean) {
    items.value.push(...newItems)
    lastCursor.value = cursor
    hasMore.value = more
  }

  function resetCurrentContext() {
    items.value = []
    lastCursor.value = null
    hasMore.value = true
  }

  return {
    context,
    items,
    lastCursor,
    hasMore,
    initContext,
    addItems,
    resetCurrentContext
  }
})
