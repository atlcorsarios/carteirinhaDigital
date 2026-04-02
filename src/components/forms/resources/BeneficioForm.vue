<template>
  <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
    <v-row>
      <v-col cols="12" :md="createFast ? 12 : 8">
        <v-text-field
          v-model="beneficio.descricao_beneficio"
          :rules="[rules.required()]"
          :label="t('forms.formBeneficios.descricao_beneficio.label', 'Descrição do Benefício *')"
          variant="outlined"
          color="primary"
          placeholder="Ex: 50% OFF em Cervejas"
        />
      </v-col>

      <v-col cols="12" :md="createFast ? 12 : 4">
        <v-text-field
          v-model.number="beneficio.desconto_aplicavel"
          :label="t('forms.formBeneficios.desconto_aplicavel.label', 'Desconto (%) *')"
          :hint="t('forms.formBeneficios.desconto_aplicavel.hint', 'Desconto em porcentagem (%)')"
          type="number"
          variant="outlined"
          color="primary"
          suffix="%"
          :rules="[
            rules.required(),
            v => v >= 0 && v <= 100 || 'Deve ser entre 0 e 100'
          ]"
        />
      </v-col>

      <template v-if="!createFast">
        <v-col cols="12">
          <v-textarea
            v-model="beneficio.restricao_beneficio"
            :label="t('forms.formBeneficios.restricao_beneficio.label', 'Restrições')"
            :hint="t('forms.formBeneficios.restricao_beneficio.hint', 'Ex: Válido apenas nas terças-feiras')"
            variant="outlined"
            color="primary"
            rows="2"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-switch
            v-model="beneficio.ativo"
            :label="t('forms.formBeneficios.ativo.label', beneficio.ativo ? 'Benefício Ativo' : 'Benefício Inativo')"
            color="success"
            inset
          />
        </v-col>

        <v-col cols="12">
          <InputParceiro
            v-model:parceiro="beneficio.parceiro"
            v-model:parceiro-id="beneficio.id_parceiro"
          />
        </v-col>
      </template>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import InputParceiro from '../fixtures/InputParceiro.vue'
import type { IBeneficiosDetalhados } from '@/classes/models/resources/ModelIBeneficios'
import { useRules } from 'vuetify/labs/rules';
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n';

const beneficio = defineModel<Partial<IBeneficiosDetalhados>>('beneficio', { required: true });
const isFormValid = defineModel<boolean>('valid', { default: false });
const emit = defineEmits(['submit']);
const props = defineProps<{
  createFast?: boolean
}>();

const rules = useRules();
const { t } = useI18n();

const formRef = ref<any>(null);

watch(() => props.createFast, (isQuick) => {
  if (isQuick) {
    if (!beneficio.value.restricao_beneficio)
      beneficio.value.restricao_beneficio = 'Sem restrições';
    beneficio.value.ativo = true;
  }
}, { immediate: true })

function submitForm() {
  if (isFormValid.value) emit('submit')
  else formRef.value?.validate()
}

defineExpose({
  reset: () => formRef.value?.reset()
});

</script>
