<template>
  <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
    <v-row dense>
      <v-col cols="12" :md="createFast ? 12 : 8">
        <v-text-field
          v-model="plano.nome"
          :rules="[rules.required()]"
          :label="t('forms.formPlanos.nome.label')"
          :hint="t('forms.formPlanos.nome.label')"
          color="primary"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <v-col cols="12" :md="createFast ? 12 : 4">
        <InputPositiveNumbers
          v-model:model="plano.preco"
          :label="t('forms.formPlanos.preco.label')"
          :max-value="null"
        />
      </v-col>

      <template v-if="!createFast">
        <v-col cols="12" md="6">
          <InputPositiveNumbers
            v-model:model="plano.dias_validade"
            :label="t('forms.formPlanos.dias_validade.label')"
            :hint="t('forms.formPlanos.dias_validade.hint')"
            :max-value="730"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-switch
            v-model="plano.ativo"
            :label="plano.ativo ? 'Plano Ativo' : 'Plano Inativo'"
            inset
            hide-details
            color="success"
            density="compact"
            class="d-flex justify-center"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="plano.descricao"
            :label="t('forms.formPlanos.descricao.label', 'Descrição do Plano')"
            variant="outlined"
            color="primary"
            rows="3"
            density="compact"
          />
        </v-col>

        <v-col cols="12">
          <v-card variant="tonal" class="pa-4" rounded="lg">
            <div class="text-subtitle-2 font-weight-bold mb-3 text-medium-emphasis">
              Benefícios Vinculados a este Plano
            </div>
            <InputBeneficios
              v-model="plano.plano_beneficios"
            />
          </v-card>
        </v-col>
      </template>

    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRules } from 'vuetify/labs/rules'
import InputBeneficios from '../fixtures/InputBeneficios.vue'
import type { IPlanosDetalhados } from '@/classes/models/resources/ModelIPlanos'
import InputPositiveNumbers from '../fixtures/InputPositiveNumbers.vue'

const { t } = useI18n()
const rules = useRules()

const plano = defineModel<Partial<IPlanosDetalhados>>('plano', { required: true })
const isFormValid = defineModel<boolean>('valid', { default: false })

const props = defineProps<{
  createFast?: boolean
}>()

const emit = defineEmits(['submit'])
const formRef = ref<any>(null)

// Valores Default no Create Fast (OTP)
watch(() => props.createFast, (isQuick) => {
  if (isQuick) {
    if (!plano.value.dias_validade) plano.value.dias_validade = 30; // Padrão: 1 mês
    if (!plano.value.descricao) plano.value.descricao = 'Plano gerado rapidamente.';
    plano.value.ativo = true;
    plano.value.plano_beneficios = []; // Rápido nasce sem benefícios
  }
}, { immediate: true })

function submitForm() {
  if (isFormValid.value) emit('submit')
  else formRef.value?.validate()
}

defineExpose({ reset: () => formRef.value?.reset() })
</script>
