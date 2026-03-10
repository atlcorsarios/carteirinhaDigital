<template>
  <div class="text-body-1 text-medium-emphasis text-center mb-6">
    {{ t('forgotPassword.stepEmail.instruction') }}
  </div>

  <v-form ref="formRef" @submit.prevent="handleSendCode">
    <v-text-field
      v-model="email"
      :rules="[rules.required(), rules.email()]"
      :label="t('forgotPassword.stepEmail.labelEmail')"
      :placeholder="t('forgotPassword.stepEmail.placeholderEmail')"
      :disabled="loading"
      prepend-inner-icon="mdi-email-outline"
      density="comfortable"
      variant="outlined"
      class="mb-2"
      clearable
    />

    <v-btn
      block
      color="primary"
      size="large"
      type="submit"
      :loading="loading"
      class="mt-4"
    >
      {{ t('forgotPassword.stepEmail.btnSend') }}
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRules } from 'vuetify/labs/rules';

const { t } = useI18n();
const rules = useRules();

const email = defineModel<string>('email', { required: true });
const props = defineProps<{ loading: boolean }>();
const emit = defineEmits(['success']);

function handleSendCode() {
  emit('success');
}
</script>
