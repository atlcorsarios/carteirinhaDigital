<template>
  <v-container>
    <GenericInfiniteList
      ref="listaGenericaRef"
      cursor-key="id"
      context-id="parceiros-vitrine"
      :fetch-data="buscarParceirosPaginado"
    >
      <template v-slot="{ items }">
        <CardParceiro :parceiros="items" />
      </template>
    </GenericInfiniteList>
  </v-container>
</template>

<script setup lang="ts">
import GenericInfiniteList from '@/components/layouts/generics/GenericInfiniteList.vue'
import CardParceiro from '@/components/cards/CardParceiro.vue'
import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { ClassUsers } from '@/classes/resources/ClassUsers'
import { UsersService } from '@/services/resources/usersService'
import { useQueryFilterStore } from '@/stores/queryFilterStore'

const queryFilterStore = useQueryFilterStore();

const buscarParceirosPaginado = async (limit: number, lastCursor: string | null) => {
  const filtroEstaticoDaTela: IQueryFilter = {
    field: 'cargo',
    condition: 'equals',
    value: 'parceiro'
  }

  const payload: TPayloadRequestPagination = {
    limit,
    cursor: lastCursor,
    filters: [
      ...queryFilterStore.activeFilters,
      filtroEstaticoDaTela
    ]
  }

  return await UsersService.paginationsUsers(payload, ClassUsers.filters);
}
</script>
