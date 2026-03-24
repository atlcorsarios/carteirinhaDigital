import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQueryFilterStore = defineStore('queryFilter', () => {
  const activeFilters = ref<any[]>([])
  const searchTrigger = ref(0)

  function setFilters(filters: any[]) {
    activeFilters.value = filters
    searchTrigger.value = Date.now()
  }

  function clearFilters() {
    activeFilters.value = []
    searchTrigger.value = Date.now()
  }

  return { activeFilters, searchTrigger, setFilters, clearFilters }
});
