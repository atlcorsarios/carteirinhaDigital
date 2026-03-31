<template>
  <GenericSearchDialog
    :title="t('dialogSearch.searchParceiro')"
    :storage-context="'parceiros'"
    :headers="ClassParceiros.headers"
    :has-create-quickly="false"
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

// Classes
import { ClassParceiros } from '@/classes/resources/ClassParceiros'
import type { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { UsersService } from '@/services/resources/usuariosService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const staticFiltersParceiros = [{ field: 'cargo', condition: 'equals', value: 'parceiro' }];

const dialogSearchModel = defineModel<ClassBaseDialog>('attributes', { required: true });
const emit = defineEmits<{
  (e: 'select-item', item: TParceiro): void
}>();

</script>
