<template>
  <v-container>
    <GenericInfiniteList
      ref="listaGenericaRef"
      cursor-key="id"
      context-id="planos"
      :service-fetch="fetchItems"
    >
      <template v-slot="{ items }">
        <div v-for="plano in items">
          <CardPlano :plano="plano" />
        </div>
      </template>
    </GenericInfiniteList>
  </v-container>
</template>

<script setup lang="ts">
import GenericInfiniteList from '@/components/layouts/generics/GenericInfiniteList.vue'
import CardPlano from '@/components/cards/CardPlano.vue'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { PlanosService } from '@/services/resources/planosService'
import { useQueryFilterStore } from '@/stores/queryFilterStore'

const queryFilterStore = useQueryFilterStore();

const fetchItems = async (limit: number, lastCursor: string | null) => {
  const payload: TPayloadRequestPagination = {
    limit,
    cursor: lastCursor,
    filters: [
      ...queryFilterStore.activeFilters
    ]
  }

  return await PlanosService.paginationsPlanos(payload);
}

</script>
