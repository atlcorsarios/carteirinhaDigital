<template>
  <GenericSearchDialog
    :title="t('dialogSearch.searchPlano')"
    :storage-context="'planos'"
    :has-create-quickly="true"
    :headers="ClassPlanos.headers"
    :filters="ClassPlanos.filters"
    :default-filter="ClassPlanos.defaultFilterConfig"
    :service-fetch="PlanosService.paginationsPlanos"
    :static-filters="staticFiltersPlanos"
    :selectItems="false"
    :dialog-search-model="dialogSearchModel"
    @select-item="(item) => $emit('select-item', item)"
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
      <CreatedFastPlano
        :dialog-create-quickly="dialogModel"
        @update:dialog-create-quickly="(val) => Object.assign(dialogModel, val)"
        @created-fast-item="onCreated"
      />
    </template>
  </GenericSearchDialog>
</template>

<script setup lang="ts">
// Componentes
import GenericSearchDialog from '../GenericSearchDialog.vue'
import BtnOpenDialog from '../../BtnOpenDialog.vue'
import CreatedFastPlano from './CreatedFastPlano.vue'

// Models
import type { IPlanos } from '@/classes/models/resources/ModelIPlanos'
import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter'

// Classes
import { ClassPlanos } from '@/classes/resources/ClassPlanos'
import type { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { PlanosService } from '@/services/resources/planosService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const staticFiltersPlanos: IQueryFilter[] = [{
  field: 'descricao',
  condition: 'contains',
  value: '',
  startDate: undefined,
  endDate: undefined,
  selectValues: undefined,
}];

const dialogSearchModel = defineModel<ClassBaseDialog>('attributes', { required: true });
const emit = defineEmits<{
  (e: 'select-item', item: IPlanos): void
}>();

</script>
