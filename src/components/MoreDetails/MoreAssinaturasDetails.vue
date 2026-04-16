<template>
  <v-card flat class="pa-4 bg-background">
    <v-row>
      <v-col cols="12" md="4">
        <v-card variant="outlined" class="h-100 pa-4" rounded="lg">
          <div class="d-flex align-center mb-4">
            <v-avatar size="48" color="primary" class="mr-3">
              <v-img v-if="assinatura.usuarios?.avatar_url" :src="assinatura.usuarios.avatar_url" />
              <v-icon v-else icon="mdi-account" />
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">{{ assinatura.usuarios?.username }}</div>
              <div class="text-caption text-medium-emphasis">{{ assinatura.usuarios?.email }}</div>
            </div>
          </div>

          <v-divider class="mb-3" />

          <div class="mb-2"><strong>Plano Atual:</strong> {{ assinatura.planos?.nome }}</div>
          <div class="mb-2"><strong>Status:</strong> <v-chip size="small" :color="statusColor">{{ assinatura.status.toUpperCase() }}</v-chip></div>
          <div><strong>Vencimento:</strong> {{ ClassFormatters.formatDate(assinatura.data_vencimento) }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-h6 font-weight-bold">
            <v-icon icon="mdi-history" class="mr-2" /> Histórico de Transações
          </h3>
          <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')" />
        </div>

        <div v-if="loading" class="d-flex justify-center pa-4">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <v-alert v-else-if="!renovacoes.length" type="info" variant="tonal">
          Nenhuma renovação ou pagamento processado para este usuário ainda.
        </v-alert>

        <v-timeline v-else density="compact" align="start" side="end">
          <v-timeline-item
            v-for="renov in renovacoes"
            :key="renov.id"
            :dot-color="renov.status_transacao === 'aprovada' ? 'success' : 'error'"
            size="small"
          >
            <v-card variant="outlined" class="mb-2">
              <v-card-text class="pa-3">
                <div class="d-flex justify-space-between">
                  <strong class="text-body-1">R$ {{ Number(renov.valor).toFixed(2) }}</strong>
                  <span class="text-caption text-medium-emphasis">{{ ClassFormatters.formatDate(renov.data_processamento) }}</span>
                </div>
                <div class="text-caption mt-1">
                  <strong>NSU Pedido:</strong> {{ renov.nsu_pedido }}<br>
                  <strong>NSU Transação:</strong> {{ renov.nsu_transacao }}
                </div>
                <div class="mt-2 text-uppercase text-caption font-weight-bold"
                    :class="renov.status_transacao === 'aprovada' ? 'text-success' : 'text-error'">
                  {{ renov.status_transacao }}
                </div>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ClassFormatters } from '@/classes/ClassFormatters';
import type { IAssinaturasDetalhadas } from '@/classes/models/resources/ModelIAssinaturas'
import { RenovacoesService } from '@/services/resources/renovacoesService'
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{ assinatura: IAssinaturasDetalhadas }>()
defineEmits(['close'])

const renovacoes = ref<any[]>([])
const loading = ref(true)

const statusColor = computed(() => {
  if (props.assinatura.status === 'ativa') return 'success'
  if (props.assinatura.status === 'vencida') return 'error'
  return 'warning'
})

onMounted(async () => {
  try {
    loading.value = true
    if (props.assinatura.usuario_id) {
      renovacoes.value = await RenovacoesService.getHistoricoPorUsuario(props.assinatura.usuario_id)
    }
  } catch (error) {
    console.error("Erro ao carregar renovações", error)
  } finally {
    loading.value = false
  }
})
</script>
