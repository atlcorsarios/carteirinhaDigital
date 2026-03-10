<template>
  <v-card class="h-100 d-flex flex-column">
    <v-card-title class="d-flex sticky-title bg-surface align-center border-b">
      <div class="text-h6 w-100 me-auto">
        {{ stock.description }}
      </div>
      <v-icon-btn
        icon="mdi-close"
        v-tooltip="t('tooltips.forms.close')"
        variant="text"
        color="info"
        @click="$emit('close')"
      />
    </v-card-title>

    <v-card-text class="pa-0 flex-grow-1 overflow-y-auto">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="historyItems"
        :items-length="totalItems"
        :loading="loading"
        :items-per-page-options="[10, 20, 50]"
        @update:options="loadHistory"
        hover
        density="comfortable"
      >
        <template #[`item.operation`]="{ item }">
          <v-chip
            :color="item.operation === 'ENTRY' ? 'success' : 'error'"
            size="small"
            variant="tonal"
          >
            {{ item.operation === 'ENTRY' ? 'Entrada' : 'Saída' }}
          </v-chip>
        </template>

        <template #[`item.date`]="{ item }">
          {{ new Date(item.date).toLocaleDateString() }}
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { IStock } from '@/classes/models/ModelIStock'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()

const props = defineProps<{
  stock: IStock
}>()

defineEmits(['close'])

// Configurações da Tabela
const itemsPerPage = ref(10)
const loading = ref(false)
const totalItems = ref(0)
const historyItems = ref<any[]>([])

const headers = [
  { title: 'Data', key: 'date', sortable: false },
  { title: 'Operação', key: 'operation', sortable: false },
  { title: 'Qtd.', key: 'amount', sortable: false },
  { title: 'Usuário', key: 'user', sortable: false }, // Opcional: quem fez a movimentação
]

// Função para buscar o histórico no backend
async function loadHistory(options: { page: number; itemsPerPage: number }) {
  loading.value = true
  try {
    // Aqui você chamará o seu service passando: props.stock.idStock, options.page e options.itemsPerPage
    // Exemplo:
    // const response = await stockServices.getHistoryByStockId(props.stock.idStock, options.page, options.itemsPerPage)
    // historyItems.value = response.data
    // totalItems.value = response.total

    // MOCK TEMPORÁRIO PARA VOCÊ TESTAR O VISUAL:
    setTimeout(() => {
      historyItems.value = [
        { date: new Date().toISOString(), operation: 'ENTRY', amount: 50, user: 'Gerson' },
        { date: new Date(Date.now() - 86400000).toISOString(), operation: 'EXIT', amount: 5, user: 'Gerson' }
      ]
      totalItems.value = 2
      loading.value = false
    }, 500)

  } catch (error) {
    console.error(error)
    loading.value = false
  }
}
</script>
