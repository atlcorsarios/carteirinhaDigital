<template>
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
</template>

<script setup lang="ts">
import { useSnackbar } from '@/composables/useSnackbar';
import { useAuthStore } from '@/stores/authStore';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const { t } = useI18n();
const rules = useRules();
const router = useRouter();
const snackbar = useSnackbar();
const authStore = useAuthStore;

const loading = ref(false);
const props = defineProps<{ otp: string }>()
const forgotForm = defineModel<{
  email: string;
  password: string;
  confirmPassword: string;
  viewPassword: boolean;
  viewConfirmPassword: boolean;
}>('forgotForm', { required: true });

async function handleAlterPassword() {
  if (forgotForm.value.password !== forgotForm.value.confirmPassword) {
    snackbar.notify('');
    NotifyService.error('validations.equal');
    return;
  }

  loading.value = true;
  try {
    await authStore.reset({
      code: props.otp,
      email: forgotForm.value.email,
      password: forgotForm.value.password,
    });

    NotifyService.success('auth.passwordChanged');
    router.push({ name: 'Home' });
  } catch (error: any) {
    NotifyService.error(error);
  } finally {
    loading.value = false;
  }
}
</script>
