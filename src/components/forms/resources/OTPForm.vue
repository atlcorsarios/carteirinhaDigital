<template>
  <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
    <v-mask-input
      v-model="otpCode.codigo"
      :rules="[rules.required()]"
      :mask="'######'"
      :label="t('forms.formOTP.codigo.label')"
      density="compact"
      variant="outlined"
      clearable
    >
      <template #prepend-inner>
        <v-icon-btn
          icon="mdi-refresh-auto"
          icon-color="info"
          variant="plain"
          @click="handleGenerateOTPCode"
        />
      </template>
    </v-mask-input>

    <InputPlano
      v-model:plano="otpCode.plano"
      v-model:idPlano="otpCode.plano_id"
    />

    <InputUsuario
      v-model:usuario="otpCode.usuario_destino"
      v-model:idUsuario="otpCode.usuario_destino_id"
    />

    <v-autocomplete
      :model-value="otpCode.cargo_destino"
      :rules="[rules.required()]"
      :label="t('forms.formOTP.cargo_destino.label')"
      :items="roleOptions"
      :filter-keys="['title', 'raw.abbr']"
      item-title="title"
      item-value="value"
      density="compact"
      variant="outlined"
    />
  </v-form>
</template>

<script setup lang="ts">
import InputPlano from '../fixtures/InputPlano.vue';
import InputUsuario from '../fixtures/InputUsuario.vue';
import { ROLE_TRANSLATIONS, validRoles } from '@/classes/models/resources/ModelUsuarios';
import type { IOTPCodeDetalhado } from '@/classes/models/resources/ModelIOTP';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

const rules = useRules();
const { t } = useI18n();

const formRef = ref<any>(null);

const otpCode = defineModel<IOTPCodeDetalhado>('otpCode', { required: true });
const isFormValid = defineModel<boolean>('valid', { default: false });

const emit = defineEmits(['submit']);

function handleGenerateOTPCode() {
  const array = new Uint32Array(1);
  globalThis.crypto.getRandomValues(array);

  const number = array[0] % 1_000_000;
  otpCode.value.codigo = number.toString().padStart(6, "0");
}

const roleOptions = computed(() => {
  return validRoles.map((role) => ({
    title: t(ROLE_TRANSLATIONS[role]),
    value: role,
  }))
});

function submitForm() {
  if (isFormValid.value) emit('submit')
  else formRef.value?.validate()
}

defineExpose({
  reset: () => formRef.value?.reset()
});

</script>
