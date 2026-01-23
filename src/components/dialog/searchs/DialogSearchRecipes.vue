<!-- <template>
  <BaseDialog
    v-model:attributes="classDialogSearchCategory.model"
    v-model:view="classDialogSearchCategory.model.view"
  >
    <template v-slot:title>
      <SearchForm
        ref="refSearchForm"
        v-model:manager="classFormQuery"
        v-model:dialogAttributes="classDialogQueryFilter.model"
        v-model:tab="activeTab"
        :loading="loading"
        :has-filters="true"
        :title-dialog-filter="t('dialogSearch.searchCategory.title')"
        @submit="handleSearch"
        @reset="handleReset"
        @add-filter="handleAddFilter"
        @open-filter="handleOpenFilter"
      />
    </template>

    <template v-slot:default>
      <DataTable
        v-model:pagination="pagination"
        v-model:data-table="modelDataTable"
        @load-more="fetchData"
        @selected-item="handleSelectItem"
      >
        <template #item.actions><span></span></template>
      </DataTable>
    </template>

    <template v-slot:actions>
      <v-spacer />
      <BtnOpenDialog
        :tooltip="t('forms.formProduct.category.create')"
        icon="mdi-plus"
        text="Nova Categoria"
        color="primary"
        @click="openQuickRegister"
      />
    </template>
  </BaseDialog>

  </template>

<script setup lang="ts">
import BaseDialog from '../BaseDialog.vue'
import SearchForm from '@/components/forms/SearchForm.vue'
import DataTable from '@/components/DataTable.vue'
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'

import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { ClassCategories } from '@/classes/products/ClassCategories' // Importe sua classe
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'
import { ModelHeaderPaginator } from '@/classes/models/ModelHeaderPaginator'
import { useSnackbar } from '@/composables/useSnackbar'
import { useI18n } from 'vue-i18n'
import { nextTick, ref, onMounted } from 'vue'

// Emite o evento quando um item é selecionado
const emits = defineEmits<{
  (e: 'select-item', item: any): void
}>()

const props = defineProps<{
  dialogSearch: any // Tipo IModelBaseDialog
}>()

const { t } = useI18n()
const { notify } = useSnackbar()

// --- Classes de Controle ---
const classDialogSearchCategory = new ClassBaseDialog({ ...props.dialogSearch })
const classFormQuery = new ClassQueryFilter()
const classDialogQueryFilter = new ClassBaseDialog({ view: false, maxHeight: 500, maxWidth: 600 })

// --- DataTable e Paginação ---
const modelDataTable = new ClassGridDataChart<any>()
const pagination = ref(new ModelHeaderPaginator())
// Configura as colunas baseadas na ClassCategories
// modelDataTable.model.modelTable.model = ClassCategories.headers

const refSearchForm = ref<InstanceType<typeof SearchForm> | null>(null)
const activeTab = ref('form')
const loading = ref(false)

// --- Lógica de Busca ---

async function fetchData() {
  loading.value = true
  try {
    // Aqui você chama seu service real
    // Exemplo: const response = await categoriesServices.findAll(pagination.value, classFormQuery.model)

    // Mock para exemplo:
    console.log('Buscando categorias com filtros:', classFormQuery.model)
    // modelDataTable.value.model.itemsTable = response.content
    // pagination.value = response.page

  } catch (error) {
    notify('Erro ao buscar categorias', 'error')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.value.page = 0 // Reseta para primeira página
  fetchData()
}

// --- Lógica de Seleção ---

function handleSelectItem(item: any) {
  // 1. Emite o item selecionado para o pai (ProductForm)
  emits('select-item', item)

  // 2. Fecha este dialog
  classDialogSearchCategory.model.view = false
}

// --- Outras Ações ---

function handleReset() {
  // Lógica de reset existente...
  if (activeTab.value === 'form') {
     classFormQuery.resetStaging({ field: classFormQuery.filters[1]?.key, condition: 'contains' })
     refSearchForm.value?.reset()
  } else {
     classFormQuery.reset()
  }
  modelDataTable.value.model.itemsTable = [] // Limpa tabela
}

function handleOpenFilter() {
  classDialogQueryFilter.toggleDialog()
}

async function handleAddFilter() {
  const validFilter = classFormQuery.addFilter()
  if (validFilter) {
    await nextTick()
    refSearchForm.value?.reset()
  } else {
    notify(t('messages.components.queryFilter.alertDuplicate'), 'warning')
  }
}

function openQuickRegister() {
  // Lógica para abrir o dialog de cadastro
  // Pode emitir um evento para o pai ou abrir um componente local
  console.log('Abrir cadastro rápido')
}

defineExpose({
  toggleDialog: () => classDialogSearchCategory.toggleDialog(),
})
</script> -->
