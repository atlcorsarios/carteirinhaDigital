<template>
  <v-container>
    <GenericInfiniteList
      ref="listaGenericaRef"
      cursor-key="id"
      context-id="produtos-vitrine"
      :service-fetch="fetchItems"
    >
      <template v-slot="{ items }">
        <div v-for="produto in items">
          <CardProduto :produto="produto" />
        </div>
      </template>
    </GenericInfiniteList>
  </v-container>
</template>

<script setup lang="ts">
import GenericInfiniteList from '@/components/layouts/generics/GenericInfiniteList.vue'
import CardProduto from '@/components/cards/CardProduto.vue'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { ProductsService } from '@/services/resources/produtosService'
import { useQueryFilterStore } from '@/stores/queryFilterStore'

const queryFilterStore = useQueryFilterStore();

const fetchItems = async (limit: number, lastCursor: string | null) => {
  const payload: TPayloadRequestPagination = {
    limit,
    cursor: lastCursor,
    filters: [ ...queryFilterStore.activeFilters ]
  }

  return await ProductsService.paginationsProducts(payload);
}

</script>
