<template>
  <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
    <v-row>
      <v-col cols="12" :md="createFast ? 12 : 8">
        <v-text-field
          v-model="beneficio.descricao_beneficio"
          :rules="[rules.required()]"
          :label="t('forms.formBeneficios.descricao_beneficio.label')"
          :hint="t('forms.formBeneficios.descricao_beneficio.hint')"
          density="compact"
          variant="outlined"
          color="primary"
        />
      </v-col>

      <v-col cols="12" :md="createFast ? 12 : 4">
        <InputPositiveNumbers
          v-model:model="descontoAplicavel"
          :label="'forms.formBeneficios.desconto_aplicavel.label'"
          :hint="'forms.formBeneficios.desconto_aplicavel.hint'"
          :prefix="'%'"
          :color="'primary'"
        />
      </v-col>

      <v-col cols="12">
        <InputParceiro
          v-model:parceiro="beneficio.parceiro"
          v-model:parceiro-id="beneficio.id_parceiro"
          :rules="[rules.required()]"
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
            color="success"
            inset
          />
        </v-col>
      </template>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import InputPositiveNumbers from '../fixtures/InputPositiveNumbers.vue';
import InputParceiro from '../fixtures/InputParceiro.vue'
import { type IBeneficiosDetalhados } from '@/classes/models/resources/ModelIBeneficios'
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { computed, ref, watch } from 'vue'

const beneficio = defineModel<Partial<IBeneficiosDetalhados>>('beneficio', { required: true });
const isFormValid = defineModel<boolean>('valid', { default: false });

const emit = defineEmits(['submit']);
const props = defineProps<{
  createFast?: boolean
}>();

const rules = useRules();
const { t } = useI18n();

const formRef = ref<any>(null);

const descontoAplicavel = computed({
  get: () => beneficio.value.desconto_aplicavel ?? 0,
  set: (v: number) => {
    beneficio.value.desconto_aplicavel = v
  }
})

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
