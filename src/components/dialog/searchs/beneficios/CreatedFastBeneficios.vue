<template>
  <GenericCreateQuickly
    :title="t('', 'Novo Benefício')"
    :icon="'mdi-star-plus'"
    :save-icon="'mdi-content-save'"
    :dialog-model="dialogModel"
    :service-save="BeneficiosService.saveBeneficio"
    :class-manager="beneficioManager"
    @created-fast-item="(item) => $emit('created-fast-item', item)"
  >
    <template #form="slotProps">
      <BeneficioForm
        :ref="slotProps.refForm"
        :beneficio="slotProps.model"
        @update:beneficio="(val) => Object.assign(slotProps.model, val)"
        @update:valid="slotProps.updateValid"
        @submit="slotProps.submitForm"
        :create-fast="true"
      />
    </template>
  </GenericCreateQuickly>
</template>

<script setup lang="ts">
import GenericCreateQuickly from '../GenericCreateQuickly.vue';
import BeneficioForm from '@/components/forms/resources/BeneficioForm.vue';
import { ClassBeneficios } from '@/classes/resources/ClassBeneficios';
import { BeneficiosService } from '@/services/resources/beneficiosService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const dialogModel = defineModel<any>('dialog-create-quickly', { required: true })
defineEmits(['created-fast-item'])

const classBeneficios = new ClassBeneficios()
const beneficioManager = {
  model: classBeneficios.model,
  reset: () => classBeneficios.reset(),
}

</script>
