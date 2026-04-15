<template>
  <GenericView
    :headers="ClassPromocoes.headers"
    id-field="id"
    context-id="admin-promocoes"
    :title="t('dataTable.promocoes.title')"
    :hasActions="true"
    :text-create="t('messages.forms.formPromocoes.create')"
    :text-edit="t('messages.forms.formPromocoes.edit')"
    icon-create="mdi-tag-plus-outline"
    icon-edit="mdi-tag-edit-outline"
    icon-save="mdi-tag-check-outline"
    :dialog-model-manager="dialogManager"
    :class-model-manager="modelManager"
    :service-fetch="fetchItems"
    :service-save="PromocoesService.savePromocao"
    :service-delete="PromocoesService.inactivatePromocao"
  >
    <template #form="{ updateValid, refForm, submitForm }">
      <PromocaoForm
        :ref="refForm"
        v-model:promocao="modelManager.model"
        @update:valid="updateValid"
        @submit="submitForm"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
import GenericView from '@/components/layouts/generics/GenericView.vue'
import PromocaoForm from '@/components/forms/resources/PromocaoForm.vue'

import type { IPromocoes } from '@/classes/models/resources/ModelIPromocoes'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { ClassPromocoes } from '@/classes/resources/ClassPromocoes'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { PromocoesService } from '@/services/resources/promocoesService'

import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n();
const route = useRoute();

const classRef = new ClassPromocoes();
const dialogManager = new ClassBaseDialog<IPromocoes>({ persistent: true, maxWidth: 800 });

const modelManager = {
  model: classRef.model,
  reset: () => classRef.reset(),
  updateModel: (item: IPromocoes) => classRef.updateModel(item),
}

const fetchItems = async (payload: TPayloadRequestPagination) => {
  return await PromocoesService.paginationsPromocoes(payload)
}

</script>
