import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGenericListStore = defineStore('genericList', () => {
  const contexts = ref<Record<string, {
    items: any[]
    lastCursor: any
    hasMore: boolean
  }>>({});

  const currentContextId = ref<string>('');

  function initContext(contextId: string) {
    currentContextId.value = contextId
    if (!contexts.value[contextId]) {
      contexts.value[contextId] = {
        items: [],
        lastCursor: null,
        hasMore: true
      }
    }
  }

  const getItems = (id: string) => contexts.value[id]?.items || []
  const getLastCursor = (id: string) => contexts.value[id]?.lastCursor || null
  const getHasMore = (id: string) => contexts.value[id]?.hasMore ?? true

  function addItems(contextId: string, newItems: any[], cursor: any, more: boolean) {
    if (contexts.value[contextId]) {
      contexts.value[contextId].items.push(...newItems)
      contexts.value[contextId].lastCursor = cursor
      contexts.value[contextId].hasMore = more
    }
  }

  function resetContext(contextId: string) {
    if (contexts.value[contextId]) {
      contexts.value[contextId].items = []
      contexts.value[contextId].lastCursor = null
      contexts.value[contextId].hasMore = true
    }
  }

  return {
    contexts,
    initContext,
    getItems,
    getLastCursor,
    getHasMore,
    addItems,
    resetContext
  }
});
