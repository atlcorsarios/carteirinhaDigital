<template>
  <GenericSearchDialog
    :title="'dialogSearch.searchBeneficios'"
    :storage-context="'beneficios'"
    :has-create-quickly="true"
    :headers="ClassBeneficios.headers"
    :filters="ClassBeneficios.filters"
    :default-filter="ClassBeneficios.defaultFilterConfig"
    :service-fetch="BeneficiosService.paginationsBeneficios"
    :static-filters="staticFiltersBeneficios"
    :dialog-search-model="dialogSearchModel"
    :is-multiple="true"
    :select-items="true"
    v-model:selectedItens="selectedItens"
  >
    <template #action-btn="{ openCreate }">
      <v-icon-btn
        icon="mdi-check"
        color="info"
        variant="text"
        v-tooltip="t('tooltips.forms.submit')"
        @click="dialogSearchModel.toggleDialog()"
      />

      <v-spacer />

      <BtnOpenDialog
        icon="mdi-seal-variant"
        color="success"
        variant="text"
        v-tooltip="t('tooltips.forms.create')"
        @click="openCreate"
      />
    </template>

    <template #create-quickly="{ dialogModel, onCreated }">
      <CreatedFastBeneficios
        :dialog-create-quickly="dialogModel"
        @update:dialog-create-quickly="(val) => Object.assign(dialogModel, val)"
        @created-fast-item="onCreated"
      />
    </template>
  </GenericSearchDialog>
</template>

<script setup lang="ts">
import GenericSearchDialog from '../GenericSearchDialog.vue';
import BtnOpenDialog from '../../BtnOpenDialog.vue';
import CreatedFastBeneficios from './CreatedFastBeneficios.vue';

import { type IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter';
import { type IBeneficios } from '@/classes/models/resources/ModelIBeneficios';

import { ClassBeneficios } from '@/classes/resources/ClassBeneficios';
import { type ClassBaseDialog } from '@/classes/ClassBaseDialog';

import { BeneficiosService } from '@/services/resources/beneficiosService';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const staticFiltersBeneficios: IQueryFilter[] = [{
  field: 'descricao_beneficio',
  condition: 'contains',
  value: '',
  startDate: undefined,
  endDate: undefined,
  selectValues: undefined,
}];

const selectedItens = defineModel<IBeneficios[]>('selectedItens', { required: true })
const dialogSearchModel = defineModel<ClassBaseDialog<any>>('attributes', { required: true });

</script>
