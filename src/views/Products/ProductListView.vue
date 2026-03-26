<template>
  <v-container>
    <GenericInfiniteList
      ref="listaGenericaRef"
      cursor-key="id"
      context-id="produtos-vitrine"
      :fetch-data="buscarProdutosPaginado"
    >
      <template v-slot="{ items }">
        <CardProduto :produtos="items" />
      </template>
    </GenericInfiniteList>
  </v-container>
</template>

<script setup lang="ts">
import GenericInfiniteList from '@/components/layouts/generics/GenericInfiniteList.vue'
import CardProduto from '@/components/cards/CardProduto.vue'
import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { ProductsService } from '@/services/resources/productsService'
import { useQueryFilterStore } from '@/stores/queryFilterStore'

const queryFilterStore = useQueryFilterStore();

const buscarProdutosPaginado = async (limit: number, lastCursor: string | null) => {
  const filtroEstaticoDaTela: IQueryFilter = {
    field: 'ativo',
    condition: 'equals',
    value: 'true'
  }

  const payload: TPayloadRequestPagination = {
    limit,
    cursor: lastCursor,
    filters: [
      ...queryFilterStore.activeFilters,
      filtroEstaticoDaTela
    ]
  }

  return await ProductsService.paginationsProducts(payload);
}

</script>
