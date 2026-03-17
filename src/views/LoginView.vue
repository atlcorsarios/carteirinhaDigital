<template>
  <div class="d-flex justify-center align-center h-100" style="min-height: 90vh">
    <v-card class="mx-auto text-center pa-8" width="100%" max-width="500" elevation="8" rounded="lg">
      <v-card-title class="text-h4 font-weight-bold mb-4 text-primary">
        {{ t('routes.login') }}
      </v-card-title>

      <v-card-text>
        <p class="text-body-1 text-grey-darken-1 mb-8">
          {{ t('forms.formLogin.text') }}
        </p>

        <BtnLoginWithGoogle
          :callback="handleGoogleLogin"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import BtnLoginWithGoogle from '@/components/forms/BtnLoginWithGoogle.vue';
import { useSnackbar } from '@/composables/useSnackbar'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { notify } = useSnackbar();
const { t } = useI18n();

const authStore = useAuthStore();
const loading = ref(false);

async function handleGoogleLogin() {
  try {
    loading.value = true
    await authStore.loginWithGoogle()
  } catch (error: any) {
    console.error(error)
    notify('Erro ao conectar com o Google. Tente novamente.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
