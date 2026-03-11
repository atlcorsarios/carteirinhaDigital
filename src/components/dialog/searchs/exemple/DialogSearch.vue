<!-- <template>
  <GenericSearchDialog
    :title="t('dialogSearch.searchResource.title')"
    :storage-context="'search_resource'"
    :headers="Class.headers"
    :filters="Class.filters"
    :default-filter="Class.defaultFilterConfig"
    :service-fetch="Service.getAll"
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

    <template #create-quickly="{ dialogModel, onCreated }">
      <CreatedFast :dialog-create-quickly="dialogModel" @created-fast-item="onCreated" />
    </template>
  </GenericSearchDialog>
</template>

<script setup lang="ts">
// Componentes
import GenericSearchDialog from '../GenericSearchDialog.vue'
import BtnOpenDialog from '../../BtnOpenDialog.vue'
import CreatedFast from './CreatedFast.vue'

// Models
import { type Interface } from '@/classes/models/resources/Interface'

// Classes
import { Class } from '@/classes/resources/Class'
import type { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { Service } from '@/services/resources/Service'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialogSearchModel = defineModel<ClassBaseDialog>('dialog-search-resource', { required: true })
const emit = defineEmits<{
  (e: 'select-item', item: Interface): void
}>()
</script> -->
