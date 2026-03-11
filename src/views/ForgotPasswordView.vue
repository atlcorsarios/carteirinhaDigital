<template>
  <div class="d-flex flex-column justify-center align-center h-100" style="min-height: 90vh">

    <v-card class="mx-auto" max-width="450" width="100%" elevation="10" rounded="lg">
      <v-card-title class="text-center pt-6 text-primary font-weight-bold">
        {{ step === 1 ? t('forgotPassword.title') : step === 2 ? t('forgotPassword.titleVerify') : t('forgotPassword.titleAlterPassword') }}
      </v-card-title>

      <v-card-text>
        <v-window v-model="step">
          <v-window-item :value="1">
            <SendOtpCode
              v-model:email="forgotForm.email"
              :loading="loading"
              @success="handleSendCode"
            />
          </v-window-item>

          <v-window-item :value="2">
            <VerifyOtpCode
              :email="forgotForm.email"
              :loading="loading"
              :time-left="timeLeft"
              :formatted-time="formattedTime"
              :allow-exchange="true"
              v-model:otp="otpCode"
              @to-step="changeStep"
              @resend-code="handleSendCode"
              @stop-timer="stopTimer"
              @success="changeStep(3)"
            />
          </v-window-item>

          <v-window-item :value="3">
            <AlterPassword
              v-model:forgot-form="forgotForm"
              :otp="otpCode"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <q-btn
      :label="t('actions.back')"
      icon="mdi-arrow-left"
      class="q-ma-lg"
      @click="router.back()"
    />
  </div>
</template>

<script setup lang="ts">
import SendOtpCode from '@/components/forms/otp/SendOtpCode.vue';
import VerifyOtpCode from '@/components/forms/otp/VerifyOtpCode.vue';
import AlterPassword from '@/components/forms/otp/AlterPassword.vue';
import { useOTPVerify } from '@/composables/useOTPVerify';
import { useI18n } from 'vue-i18n';
import { onUnmounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const { loading, step, otpCode, timeLeft, formattedTime, stopTimer, changeStep, sendCode } = useOTPVerify();
const router = useRouter();

const forgotForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  viewPassword: false,
  viewConfirmPassword: false
});

onUnmounted(() => {
  stopTimer();
});

async function handleSendCode() {
  otpCode.value = "";
  await sendCode(forgotForm.email, { navStep: 2 });
}

</script>
