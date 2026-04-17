<template>
  <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
    <v-row dense>
      <v-col cols="12" :md="createFast ? 12 : 8">
        <v-text-field
          v-model="plano.nome"
          :rules="[rules.required()]"
          :label="t('forms.formPlanos.nome.label')"
          :hint="t('forms.formPlanos.nome.hint')"
          color="primary"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <v-col cols="12" :md="createFast ? 12 : 4">
        <InputPrice
          v-model="plano.preco"
          :label="'forms.formPlanos.preco.label'"
          :hint="'forms.formPlanos.preco.hint'"
          :rules="[rules.required()]"
        />
      </v-col>

      <template v-if="!createFast">
        <v-col cols="12" md="6">
          <InputPositiveNumbers
            v-model:model="plano.dias_validade"
            :label="'forms.formPlanos.dias_validade.label'"
            :hint="'forms.formPlanos.dias_validade.hint'"
            :max-value="730"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-switch
            v-model="plano.ativo"
            :label="plano.ativo ? t('forms.campoAtivo.true') : t('forms.campoAtivo.false')"
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
            :label="t('forms.formPlanos.descricao.label')"
            variant="outlined"
            color="primary"
            rows="3"
            density="compact"
          />
        </v-col>

        <v-col cols="12">
          <v-card variant="tonal" class="pa-4" rounded="lg">
            <div class="text-subtitle-2 font-weight-bold mb-3 text-medium-emphasis">
              {{ t('forms.formPlanos.beneficios.text') }}
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
import InputBeneficios from '../fixtures/InputBeneficios.vue'
import InputPrice from '../fixtures/InputPrice.vue'
import InputPositiveNumbers from '../fixtures/InputPositiveNumbers.vue'
import type { IPlanosDetalhados } from '@/classes/models/resources/ModelIPlanos'
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'

const { t } = useI18n();
const rules = useRules();

const plano = defineModel<Partial<IPlanosDetalhados>>('plano', { required: true });
const isFormValid = defineModel<boolean>('valid', { default: false });

const props = defineProps<{
  createFast?: boolean
}>();

const emit = defineEmits(['submit']);
const formRef = ref<any>(null);

watch(() => props.createFast, (isQuick) => {
  if (isQuick) {
    if (!plano.value.dias_validade) plano.value.dias_validade = 30;
    if (!plano.value.descricao) plano.value.descricao = 'Plano gerado rapidamente.';
    plano.value.ativo = true;
    plano.value.plano_beneficios = [];
  }
}, { immediate: true });

function submitForm() {
  if (isFormValid.value) emit('submit')
  else formRef.value?.validate()
}

defineExpose({ reset: () => formRef.value?.reset() });
</script>
