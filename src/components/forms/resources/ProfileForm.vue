<template>
  <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handleSubmit">
    <v-row dense>
      <v-col cols="12">
        <InputUploadImage
          v-model:url="profile.avatar_url"
          :bucket="'avatars'"
          :disabled="readonly"
          class="mb-5"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="profile.username"
          :rules="[rules.required(), rules.maxLength(30)]"
          :label="t('forms.formUser.username.label')"
          :hint="t('forms.formUser.username.hint')"
          :counter="30"
          :readonly="readonly"
          :variant="readonly ? 'plain' : 'outlined'"
          density="compact"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-mask-input
          v-model="profile.celular_contato"
          mask="(##) #####-####"
          placeholder="(##) #####-####"
          :label="t('forms.formUser.celular_contato.label')"
          :readonly="readonly"
          :variant="readonly ? 'plain' : 'outlined'"
          density="compact"
          clearable
        />
      </v-col>

      <v-col cols="12">
        <InputUserRole
          v-model:role="profile.cargo"
          v-model:otp="otp"
          :user="profile"
          :readonly="readonly"
        />
      </v-col>

      <v-col v-if="profile.cargo === 'parceiro' && !readonly" cols="12">
        <v-text-field
          v-model="nome_fantasia"
          :label="t('forms.formParceiro.nome_fantasia.label')"
          :readonly="readonly"
          :variant="readonly ? 'plain' : 'outlined'"
          density="compact"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="profile.email"
          :rules="[rules.required(), rules.email(), rules.maxLength(150)]"
          :label="t('forms.formUser.email.label')"
          disabled
          :variant="readonly ? 'plain' : 'outlined'"
          density="compact"
        />
      </v-col>

      <v-col cols="12" md="6">
        <InputUserDocumento v-if="!readonly"
          v-model:documento="profile.documento"
          :disabled="true"
        />
      </v-col>
    </v-row>

    <template v-if="!readonly">
      <v-divider class="mt-4" />

      <div class="d-flex justify-center mt-3">
        <v-icon-btn
          type="submit"
          icon="mdi-content-save-check"
          variant="flat"
          color="success"
          v-tooltip="t('tooltips.forms.submit')"
          :disabled="loading"
          :loading="loading"
          class="mx-auto text-center mt-3"
        />
      </div>
    </template>
  </v-form>
</template>

<script setup lang="ts">
import InputUploadImage from '../fixtures/InputUploadImage.vue'
import InputUserRole from '../fixtures/InputUserRole.vue'
import InputUserDocumento from '../fixtures/InputUserDocumento.vue'
import { type IUser } from '@/classes/models/resources/ModelUsuarios'
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const rules = useRules();
const { t } = useI18n();

const formRef = ref<any>(null);

const props = withDefaults(defineProps<{
  loading?: boolean
  readonly?: boolean
}>(), {
  loading: false,
  readonly: false
});

const profile = defineModel<IUser>('profile', { required: true });
const otp = defineModel<string>('otp', { required: true });
const nome_fantasia = defineModel<string>('nome_fantasia');
const formIsValid = defineModel<boolean>('valid', { default: false });
const emit = defineEmits(['submit']);

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    emit('submit')
  }
}

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate()
    return valid
  },
});

</script>
