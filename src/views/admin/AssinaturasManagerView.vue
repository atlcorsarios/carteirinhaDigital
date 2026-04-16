<template>
  <GenericView
    :headers="ClassAssinaturas.headers"
    id-field="id"
    cursor-key="created_at"
    context-id="admin-assinaturas"
    :title="t('dataTable.assinaturas', 'Gestão de Assinaturas')"
    :hasActions="false"
    :hasMoreDetails="true"
    :dialog-model-manager="dialogManager"
    :class-model-manager="modelManager"
    :service-fetch="fetchItems"
  >
    <template #moreDetails="{ item, close }">
      <MoreAssinaturasDetails
        :assinatura="item"
        @close="close"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
import GenericView from '@/components/layouts/generics/GenericView.vue'
import MoreAssinaturasDetails from '@/components/MoreDetails/MoreAssinaturasDetails.vue'
import type { IAssinaturasDetalhadas } from '@/classes/models/resources/ModelIAssinaturas'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { ClassAssinaturas } from '@/classes/resources/ClassAssinaturas'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { AssinaturasService } from '@/services/resources/assinaturasService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const classRef = new ClassAssinaturas();
const dialogManager = new ClassBaseDialog<IAssinaturasDetalhadas>({
  persistent: true,
  maxWidth: 600,
});

const modelManager = {
  model: classRef.model,
  reset: () => classRef.reset(),
  updateModel: (item: IAssinaturasDetalhadas) => classRef.updateModel(item),
}

const fetchItems = async (payload: TPayloadRequestPagination) => {
  return await AssinaturasService.paginationsAssinaturas(payload);
}

</script>
