<template>
  <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
    <InputUploadImage
      v-model:url="formData.avatar_url"
      :bucket="'avatars'"
      class="mb-5"
    />

    <InputUserRole
      v-model:role="formData.cargo"
      v-model:otp="formData.codigo_otp"
      :density="'comfortable'"
      :variant="'outlined'"
    />

    <InputUserDocumento
      v-model:documento="formData.documento"
      :density="'comfortable'"
      :variant="'outlined'"
    />

    <v-mask-input
      v-model="formData.celular_contato"
      :rules="[rules.required()]"
      :label="t('forms.formUser.celular_contato.label')"
      mask="(##) #####-####"
      density="comfortable"
      variant="outlined"
    />

    <v-icon-btn
      type="submit"
      icon="mdi-content-save-check"
      variant="flat"
      color="success"
      v-tooltip="t('tooltips.forms.submit')"
      :disabled="loading"
      :loading="loading"
      class="mt-3"
    />
  </v-form>
</template>

<script setup lang="ts">
import InputUploadImage from '@/components/forms/fixtures/InputUploadImage.vue'
import InputUserRole from '../fixtures/InputUserRole.vue';
import InputUserDocumento from '../fixtures/InputUserDocumento.vue';
import type { IOnboardingData } from '@/classes/models/ModelOnboardingData';
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n';
import { ref } from 'vue'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: typeof formData.value): void
}>()

const rules = useRules()
const { t } = useI18n();

const formRef = ref()
const isValid = ref(false)

const formData = ref<IOnboardingData>({
  avatar_url: '',
  cargo: 'aluno',
  codigo_otp: '',
  documento: '',
  celular_contato: '',
})

async function handleSubmit(event: any) {
  const { valid } = await event;
  if (valid) emit('submit', { ...formData.value });
}
</script>
