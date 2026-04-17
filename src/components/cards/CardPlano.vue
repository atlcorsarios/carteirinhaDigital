<template>
  <v-card
    class="d-flex flex-column rounded-xl border mx-auto transition-swing"
    elevation="0"
    max-width="350"
    min-height="450"
    :disabled="!plano.ativo"
  >
    <v-card-item class="text-center pt-8 pb-4">
      <v-chip
        v-if="!plano.ativo"
        color="error"
        size="small"
        class="mb-4 font-weight-bold"
      >
        {{ t('forms.campoAtivo.false') }}
      </v-chip>

      <v-card-title
        class="text-h4 font-weight-black text-primary text-uppercase mb-2"
        style="white-space: normal;"
        >
        {{ plano.nome }}
      </v-card-title>

      <v-card-subtitle class="text-body-2 text-wrap px-4">
        {{ plano.descricao }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="text-center pb-4">
      <div
        v-if="showingDetails"
        class="text-h3 font-weight-black text-surface-variant"
      >
        {{ ClassFormatters.formatPriceDynamic(plano.preco) }}
      </div>
      <div class="text-caption text-medium-emphasis font-weight-medium mt-1">
        {{ t('forms.formPlanos.dias_validade.text', { dias_validade: plano.dias_validade }) }}
      </div>
    </v-card-text>

    <v-divider class="mx-6 mb-4" />

    <v-card-text v-if="beneficios.length > 0" class="flex-grow-1 pt-0 px-6">
      <div class="text-subtitle-2 font-weight-bold mb-3 text-medium-emphasis">
        {{ t('forms.formPlanos.beneficios.headerTable') }}
      </div>

      <v-progress-circular
        v-if="loadingBeneficios"
        indeterminate
        color="primary"
        size="24"
        class="d-block mx-auto mt-6"
      />

      <v-list
        v-else
        density="compact"
        class="bg-transparent pa-0"
      >
        <v-list-item
          v-for="ben in beneficios"
          :key="ben.id"
          class="px-0 min-h-0 mb-2"
        >
          <template #prepend>
            <v-icon
              icon="mdi-check-circle"
              color="success"
              size="small"
              class="mr-3 opacity-80"
            />
          </template>
          <v-list-item-title class="text-body-2 text-wrap font-weight-medium">
            {{ ben.descricao_beneficio }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions v-if="!showingDetails" class="pa-6 pt-0">
      <v-btn
        block
        color="primary"
        variant="flat"
        size="x-large"
        class="rounded-lg font-weight-bold text-none"
        elevation="2"
      >
        {{ plano.preco > 0 ?
          t('messages.forms.formPlanos.assinar', { preco: ClassFormatters.formatPriceDynamic(plano.preco) }) :
          t('messages.forms.formPlanos.free')
        }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { IPlanos } from '@/classes/models/resources/ModelIPlanos'
import { ClassFormatters } from '@/classes/ClassFormatters'
import { PlanoBeneficiosService } from '@/services/resources/planoBeneficiosService'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'

const { t } = useI18n();

const props = withDefaults(defineProps<{
  plano: IPlanos,
  showingDetails?: boolean
}>(), {
  showingDetails: false
});

const beneficios = ref<any[]>([]);
const loadingBeneficios = ref(true);

onMounted(async () => {
  if (props.plano?.id) {
    loadingBeneficios.value = true
    beneficios.value = await PlanoBeneficiosService.getBeneficiosByPlanoId(props.plano.id)
    loadingBeneficios.value = false
  } else {
    loadingBeneficios.value = false
  }
});

</script>

<style scoped>
.transition-swing {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.v-card:not(.v-card--disabled):hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15) !important;
}
</style>
