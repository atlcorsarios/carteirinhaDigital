<template>
  <GenericView
    :headers="ClassParceiros.headers"
    id-field="id"
    cursor-key="created_at"
    context-id="parceiros-vitrine"
    :title="'dataTable.parceiros'"
    :hasActions="false"
    :hasMoreDetails="true"
    :dialog-model-manager="dialogManager"
    :class-model-manager="modelManager"
    :service-fetch="fetchItems"
  >
    <template #moreDetails="{ item, close }">
      <MoreUsuariosDetails
        :usuario="item"
        @close="close"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
import GenericView from '@/components/layouts/generics/GenericView.vue'
import MoreUsuariosDetails from '@/components/MoreDetails/MoreUsuariosDetails.vue'
import type { TParceiro } from '@/classes/models/resources/ModelUsuarios'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { ClassParceiros } from '@/classes/resources/ClassParceiros'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ParceirosService } from '@/services/resources/parceirosService'

const classRef = new ClassParceiros();
const dialogManager = new ClassBaseDialog<TParceiro>({
  persistent: true,
  maxWidth: 600,
});

const modelManager = {
  model: classRef.model,
  reset: () => classRef.reset(),
  updateModel: (item: TParceiro) => classRef.updateModel(item),
}

const fetchItems = async (payload: TPayloadRequestPagination) => {
  return await ParceirosService.paginationsParceiros(payload);
}

</script>
