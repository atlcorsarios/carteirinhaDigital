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
            <div class="text-body-1 text-medium-emphasis text-center mb-6">
              {{ t('forgotPassword.stepAlterPassword.instruction') }}
            </div>

            <v-form ref="formRef" @submit.prevent="handleAlterPassword">
              <v-text-field
                v-model="forgotForm.password"
                :rules="[rules.required(), rules.maxLength(20), rules.minLength(6)]"
                :label="t('forgotPassword.stepAlterPassword.labelNewPassword')"
                :placeholder="t('forgotPassword.stepAlterPassword.placeholderNewPassword')"
                :type="forgotForm.viewPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                density="comfortable"
                class="mb-2"
                :disabled="loading"
              >
                <template #append-inner>
                  <v-icon-btn
                    :icon="forgotForm.viewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="forgotForm.viewPassword = !forgotForm.viewPassword"
                    density="compact"
                    variant="text"
                  />
                </template>
              </v-text-field>

              <v-text-field
                v-model="forgotForm.confirmPassword"
                :rules="[rules.required(), rules.maxLength(20), rules.minLength(6)]"
                :label="t('forgotPassword.stepAlterPassword.labelConfirmPassword')"
                :placeholder="t('forgotPassword.stepAlterPassword.placeholderConfirmPassword')"
                :type="forgotForm.viewConfirmPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                density="comfortable"
                class="mb-2"
                :disabled="loading"
              >
                <template #append-inner>
                  <v-icon-btn
                    :icon="forgotForm.viewConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="forgotForm.viewConfirmPassword = !forgotForm.viewConfirmPassword"
                    density="compact"
                    variant="text"
                  />
                </template>
              </v-text-field>

              <v-btn
                block
                color="primary"
                size="large"
                type="submit"
                :loading="loading"
                class="mt-4"
              >
                {{ t('forgotPassword.stepAlterPassword.btnAlterPassword') }}
              </v-btn>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import SendOtpCode from '@/components/forms/otp/SendOtpCode.vue';
import VerifyOtpCode from '@/components/forms/otp/VerifyOtpCode.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { ClassFormatters } from '@/classes/ClassFormatters';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ref, computed, onUnmounted } from 'vue';

const { t } = useI18n();
const router = useRouter();
const { notify } = useSnackbar();
const rules = useRules();

const step = ref(1);
const loading = ref(false);
const formRef = ref<any>(null);
const forgotForm = ref<{
  email: string
  password: string
  viewPassword: boolean
  confirmPassword: string
  viewConfirmPassword: boolean
}>({
  email: '',
  password: '',
  viewPassword: false,
  confirmPassword: '',
  viewConfirmPassword: false,
});
const otp = ref('');

const timeLeft = ref(0);
const TIMER_DURATION = 120;
let timerInterval: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => ClassFormatters.formatTime(timeLeft.value))

function startTimer() {
  stopTimer();
  timeLeft.value = TIMER_DURATION;

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

onUnmounted(() => {
  stopTimer();
});

async function handleSendCode() {
  const { valid } = await formRef.value?.validate();

  if (valid) {
    loading.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      step.value = 2;
      startTimer();
      notify(t('forgotPassword.feedback.sentSuccess'), 'success');

    } catch (error) {
      notify(t('forgotPassword.feedback.sentError'), 'error');
    } finally {
      loading.value = false;
    }
  }
}

async function handleVerifyCode() {
  if (otp.value.length < 6) return;

  loading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    notify(t('forgotPassword.feedback.verifySuccess'), 'success');
    step.value = 3;
  } catch (error) {
    notify(t('forgotPassword.feedback.verifyError'), 'error');
  } finally {
    loading.value = false;
  }
}

async function handleAlterPassword() {
  const { valid } = await formRef.value?.validate();

  if (valid) {

    loading.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      notify(t('forgotPassword.feedback.alterSuccess'), 'success');
      router.push({ name: 'Login'})
    } catch (error) {
      notify(t('forgotPassword.feedback.alterError'), 'error');
    } finally {
      loading.value = false;
    }
  }
}

async function resendCode() {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    otp.value = '';
    startTimer();
    notify(t('forgotPassword.feedback.resendInfo'), 'info');
  } finally {
    loading.value = false;
  }
}

function changeEmail() {
  stopTimer();
  step.value = 1;
  otp.value = '';
}

</script>
