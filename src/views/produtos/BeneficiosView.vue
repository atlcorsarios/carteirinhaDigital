<template>
  <GenericView
    :headers="ClassBeneficios.headers"
    id-field="id"
    cursor-key="created_at"
    :context-id="String(route.name)"
    :title="'dataTable.beneficios'"
    :hasActions="true"
    :text-create="t('messages.forms.formBeneficios.create')"
    :text-edit="t('messages.forms.formBeneficios.edit')"
    icon-create="mdi-star-plus-outline"
    icon-edit="mdi-star-cog-outline"
    icon-save="mdi-star-check-outline"
    :dialog-model-manager="dialogManager"
    :class-model-manager="modelManager"
    :service-fetch="fetchItems"
    :service-save="BeneficiosService.saveBeneficio"
    :service-delete="BeneficiosService.inactivateBeneficio"
  >
    <template #form="{ updateValid, refForm, submitForm }">
      <BeneficioForm
        :ref="refForm"
        v-model:beneficio="modelManager.model"
        @update:valid="updateValid"
        @submit="submitForm"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
import GenericView from '@/components/layouts/generics/GenericView.vue'
import BeneficioForm from '@/components/forms/resources/BeneficioForm.vue'
import type { IBeneficios } from '@/classes/models/resources/ModelIBeneficios'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { ClassBeneficios } from '@/classes/resources/ClassBeneficios'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { BeneficiosService } from '@/services/resources/beneficiosService'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n();
const route = useRoute();

const classRef = new ClassBeneficios();
const dialogManager = new ClassBaseDialog<IBeneficios>({ persistent: true, maxWidth: 700 });

const modelManager = {
  model: classRef.model,
  reset: () => classRef.reset(),
  updateModel: (item: IBeneficios) => classRef.updateModel(item),
}

const fetchItems = async (payload: TPayloadRequestPagination) => {
  return await BeneficiosService.paginationsBeneficios(payload)
}

</script>
