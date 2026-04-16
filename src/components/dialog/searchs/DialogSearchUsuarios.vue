<template>
  <GenericSearchDialog
    :title="t('dialogSearch.searchUsuario')"
    :storage-context="'usuarios'"
    :has-create-quickly="false"
    :headers="ClassUsuarios.headers"
    :filters="ClassUsuarios.filters"
    :default-filter="ClassUsuarios.defaultFilterConfig"
    :service-fetch="UsersService.paginationsUsers"
    :dialog-search-model="dialogSearchModel"
    :selectItems="false"
    @select-item="(item) => $emit('select-item', item)"
  />
</template>

<script setup lang="ts">
// Componentes
import GenericSearchDialog from './GenericSearchDialog.vue'

// Models
import { type IUser } from '@/classes/models/resources/ModelUsuarios'

// Classes
import { ClassUsuarios } from '@/classes/resources/ClassUsuarios'
import type { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { UsersService } from '@/services/resources/usuariosService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const dialogSearchModel = defineModel<ClassBaseDialog>('attributes', { required: true });
const emit = defineEmits<{
  (e: 'select-item', item: IUser): void
}>();

</script>
