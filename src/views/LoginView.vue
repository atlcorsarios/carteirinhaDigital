<template>
  <div class="d-flex justify-center align-center h-100" style="min-height: 90vh">
    <v-card class="mx-auto text-center pa-8" width="500" elevation="8" rounded="lg">
      <v-card-title class="text-h4 font-weight-bold mb-4 text-primary">
        {{ t('routes.login') || 'Sistema da Atlética' }}
      </v-card-title>

      <v-card-text>
        <p class="text-body-1 text-grey-darken-1 mb-8">
          Faça login com sua conta do Google para acessar a plataforma, sua carteirinha e nossos parceiros.
        </p>

        <v-btn
          color="error"
          size="x-large"
          block
          prepend-icon="mdi-google"
          :loading="loading"
          @click="handleGoogleLogin"
        >
          Entrar com o Google
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useSnackbar } from '@/composables/useSnackbar'
import { useI18n } from 'vue-i18n'

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
