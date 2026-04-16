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
import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { ClassUsuarios } from '@/classes/resources/ClassUsuarios'
import { UsersService } from '@/services/resources/usuariosService'
import { useQueryFilterStore } from '@/stores/queryFilterStore'

const queryFilterStore = useQueryFilterStore();

const fetchItems = async (limit: number, lastCursor: string | null) => {
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

  return await UsersService.paginationsUsers(payload, ClassUsuarios.filters);
}
</script>
