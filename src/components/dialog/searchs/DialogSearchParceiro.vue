<template>
  <GenericSearchDialog
    :title="t('dialogSearch.searchParceiro')"
    :storage-context="'parceiros'"
    :has-create-quickly="false"
    :headers="ClassParceiros.headers"
    :filters="ClassParceiros.filters"
    :default-filter="ClassParceiros.defaultFilterConfig"
    :service-fetch="UsersService.paginationsUsers"
    :static-filters="staticFiltersParceiros"
    :dialog-search-model="dialogSearchModel"
    @select-item="(item) => $emit('select-item', item)"
  >
    <template #action-btn="{ openCreate }">
      <BtnOpenDialog
        v-tooltip="t('tooltips.forms.create')"
        icon="mdi-plus"
        @click="openCreate"
      />
    </template>
  </GenericSearchDialog>
</template>

<script setup lang="ts">
// Componentes
import GenericSearchDialog from './GenericSearchDialog.vue'
import BtnOpenDialog from '../BtnOpenDialog.vue'

// Models
import { type TParceiro } from '@/classes/models/resources/ModelUsuarios'
import { type IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter'

// Classes
import { ClassParceiros } from '@/classes/resources/ClassParceiros'
import { type ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { UsersService } from '@/services/resources/usuariosService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const staticFiltersParceiros: IQueryFilter[] = [
  {
    field: 'cargo',
    condition: 'equals',
    value: 'parceiro',
    startDate: undefined,
    endDate: undefined,
    selectValues: undefined
  },
  {
    field: 'ativo',
    condition: 'equals',
    value: 'true',
    startDate: undefined,
    endDate: undefined,
    selectValues: undefined,
  }
];

const dialogSearchModel = defineModel<ClassBaseDialog>('attributes', { required: true });
const emit = defineEmits<{
  (e: 'select-item', item: TParceiro): void
}>();

</script>
