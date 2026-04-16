<template>
  <GenericCreateQuickly
    :title="t('messages.forms.formPlanos.create')"
    icon="mdi-medal"
    save-icon="mdi-content-save"
    :dialog-model="dialogModel"
    :service-save="PlanosService.savePlano"
    :class-manager="planoManager"
    @created-fast-item="(item) => $emit('created-fast-item', item)"
  >
    <template #form="slotProps">
      <PlanoForm
        :ref="slotProps.refForm"
        v-model:plano="slotProps.model"
        @update:valid="slotProps.updateValid"
        @submit="slotProps.submitForm"
        :create-fast="true"
      />
    </template>
  </GenericCreateQuickly>
</template>

<script setup lang="ts">
import GenericCreateQuickly from '../GenericCreateQuickly.vue';
import PlanoForm from '@/components/forms/resources/PlanoForm.vue';
import { ClassPlanos } from '@/classes/resources/ClassPlanos';
import { useI18n } from 'vue-i18n';
import { PlanosService } from '@/services/resources/planosService';

const { t } = useI18n();

const dialogModel = defineModel<any>('dialog-create-quickly', { required: true });
defineEmits(['created-fast-item']);

const classPlanos = new ClassPlanos();
const planoManager = {
  model: classPlanos.model,
  reset: () => classPlanos.reset(),
}

</script>
