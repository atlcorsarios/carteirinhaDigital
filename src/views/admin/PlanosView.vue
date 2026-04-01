<template>
  <GenericView
    :headers="ClassPlanos.headers"
    id-field="id"
    :context-id="String(route.name)"
    :title="t('dataTable.planos.title')"
    :hasActions="true"
    :text-create="t('messages.forms.formPlanos.create')"
    :text-edit="t('messages.forms.formPlanos.edit')"
    icon-create="mdi-card-plus-outline"
    icon-edit="mdi-card-text-outline"
    icon-save="mdi-content-save-check-outline"
    :dialog-model-manager="dialogManager"
    :class-model-manager="modelManager"
    :service-fetch="fetchItems"
    :service-save="PlanosService.savePlano"
    :service-delete="PlanosService.inactivatePlano"
  >
    <template #form="{ updateValid, refForm, submitForm }">
      <PlanoForm
        :ref="refForm"
        v-model:plano="modelManager.model"
        @update:valid="updateValid"
        @submit="submitForm"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
import GenericView from '@/components/layouts/generics/GenericView.vue'
import PlanoForm from '@/components/forms/resources/PlanoForm.vue'

import type { IPlanos } from '@/classes/models/resources/ModelIPlanos'
import { ClassPlanos } from '@/classes/resources/ClassPlanos'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { PlanosService } from '@/services/resources/planosService'

import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const classRef = new ClassPlanos()
const dialogManager = new ClassBaseDialog<IPlanos>({ persistent: true, maxWidth: 800 })

const modelManager = {
  model: classRef.model,
  reset: () => classRef.reset(),
  updateModel: (item: IPlanos) => classRef.updateModel(item),
}

const fetchItems = async (limit: number, cursor: any) => {
  return await PlanosService.paginationsPlanos({ limit, cursor, filters: [] })
}
</script>
