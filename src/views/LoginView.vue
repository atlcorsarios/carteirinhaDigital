<template>
  <div class="d-flex justify-center mb-5" v-if="loading">
    <v-progress-circular color="primary" indeterminate />
  </div>

  <div class="d-flex justify-center align-center h-100" style="min-height: 90vh">
    <v-card class="mx-auto" width="600" elevation="8" rounded="lg">
      <v-card-title class="d-flex justify-center pt-5 pb-5">
        {{ t('routes.login.title') }}
      </v-card-title>
      <LoginForm
        ref="refFormLogin"
        v-model:login="classLogin.model"
        v-model:valid="isFormValid"
        @submit="handleSubmit"
      >
        <template v-slot:actions>
          <div class="d-flex flex-row">
            <v-icon-btn
              icon="mdi-refresh"
              v-tooltip="t('tooltips.forms.reset')"
              variant="text"
              color="amber"
              class="ma-3"
              @click="handleReset"
            />

            <v-spacer />

            <v-icon-btn
              icon="mdi-lock-reset"
              v-tooltip="t('tooltips.forms.forgotPassword')"
              variant="text"
              color="primary"
              class="ma-3"
              @click="forgotPassword"
            />

            <v-spacer />

            <v-icon-btn
              icon="mdi-login-variant"
              v-tooltip="t('tooltips.forms.submit')"
              variant="text"
              color="success"
              class="ma-3"
              @click="handleSubmit"
            />
          </div>
        </template>
      </LoginForm>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/forms/LoginForm.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { ClassLogin } from '@/classes/ClassLogin';
import { authServices } from '@/services/authService'
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { nextTick, ref } from 'vue';

const classLogin = new ClassLogin();
const refFormLogin = ref<InstanceType<typeof LoginForm> | null>(null);
const isFormValid = ref(false);

const router = useRouter();
const { t } = useI18n();
const { notify } = useSnackbar();
const loading = ref(false)
const authService = authServices;

async function authLogin() {
  const isValid = await refFormLogin.value?.validate()
  if (isValid) {
    try {
      loading.value = true
      await authService.login(classLogin.model)
      const usuarioLogado = await authServices.getByToken()

      notify(`${t('messages.welcome')}, ${usuarioLogado.username}!`, 'success')
    } catch (err) {
      notify(err as string || 'messages.errors.reqGenerics', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }
}

async function handleReset() {
  classLogin.reset();
  await nextTick();
  refFormLogin.value?.reset();
}

function forgotPassword() {
  router.push({ name: 'ForgotPassword' });
}

async function handleSubmit() {
  classLogin.saveEmailPreference()
  await nextTick();
  await authLogin();
}

</script>
