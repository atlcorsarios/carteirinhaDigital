<template>
  <GenericView
    :headers="ClassDescontosGerais.headers"
    id-field="id"
    context-id="admin-descontos"
    :title="t('dataTable.descontos.title')"
    :hasActions="true"
    :text-create="t('messages.forms.formDescontos.create')"
    :text-edit="t('messages.forms.formDescontos.edit')"
    icon-create="mdi-sale"
    icon-edit="mdi-pencil-outline"
    icon-save="mdi-check-all"
    :dialog-model-manager="dialogManager"
    :class-model-manager="modelManager"
    :service-fetch="fetchItems"
    :service-save="DescontosGeraisService.saveDesconto"
    :service-delete="DescontosGeraisService.inactivateDesconto"
  >
    <template #form="{ updateValid, refForm, submitForm }">
      <DescontoForm
        :ref="refForm"
        v-model:desconto="modelManager.model"
        @update:valid="updateValid"
        @submit="submitForm"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
import GenericView from '@/components/layouts/generics/GenericView.vue'
import DescontoForm from '@/components/forms/resources/DescontoForm.vue'

import type { IDescontosGerais } from '@/classes/models/resources/ModelIDescontosGerais'
import { ClassDescontosGerais } from '@/classes/resources/ClassDescontosGerais'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { DescontosGeraisService } from '@/services/resources/descontosGeraisService'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const classRef = new ClassDescontosGerais()

const dialogManager = new ClassBaseDialog<IDescontosGerais>({ persistent: true, maxWidth: 600 })

const modelManager = {
  model: classRef.model,
  reset: () => classRef.reset(),
  updateModel: (item: IDescontosGerais) => classRef.updateModel(item),
}

const fetchItems = async (limit: number, cursor: any) => {
  return await DescontosGeraisService.paginationsDescontos({ limit, cursor, filters: [] })
}
</script>
