<template>
  <div class="text-body-2 text-center mb-6">
    {{ t('forgotPassword.stepVerify.instruction') }}<br>
    <strong>{{ email }}</strong>
  </div>

  <v-sheet color="transparent" class="mb-6">
    <v-otp-input
      v-model="otp"
      type="number"
      length="6"
      variant="outlined"
      color="primary"
      :disabled="loading"
      @finish="handleVerifyCode"
    ></v-otp-input>
  </v-sheet>

  <div class="text-center text-caption mb-6">
    <div v-if="timeLeft > 0">
      {{ t('forgotPassword.stepVerify.expiresIn') }}
      <span class="font-weight-bold text-error">{{ formattedTime }}</span>
    </div>
    <div v-else class="d-flex flex-column align-center gap-2">
      <span class="text-grey">{{ t('forgotPassword.stepVerify.expired') }}</span>
      <v-btn
        variant="text"
        color="secondary"
        size="small"
        :loading="loading"
        @click="resendCode"
      >
        {{ t('forgotPassword.stepVerify.btnResend') }}
      </v-btn>
    </div>
  </div>

  <v-btn
    block
    color="primary"
    size="large"
    @click="handleVerifyCode"
    :disabled="otp.length < 6"
    :loading="loading"
  >
    {{ t('forgotPassword.stepVerify.btnVerify') }}
  </v-btn>

  <v-btn
    v-if="allowExchange"
    :disabled="loading"
    block
    variant="text"
    class="mt-2"
    size="small"
    @click="changeEmail"
  >
    {{ t('forgotPassword.stepVerify.btnChangeEmail') }}
  </v-btn>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const otp = defineModel<string>('otp', { required: true });
const props = defineProps<{
  email: string;
  timeLeft: number;
  formattedTime: string;
  loading: boolean;
  allowExchange: boolean;
}>();

const emit = defineEmits<{
  (e: 'to-step', step: number): void;
  (e: 'resendCode'): void;
  (e: 'stopTimer'): void;
  (e: 'success'): void;
}>();

function handleVerifyCode() {
  if (otp.value.length === 6) {
    emit('success');
  } else {
    return;
  }
}

function resendCode() {
  emit('resendCode');
}

function changeEmail() {
  otp.value = "";
  emit('to-step', 1);
  emit('stopTimer');
}

</script>
