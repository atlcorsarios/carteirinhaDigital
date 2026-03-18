<template>
  <div class="d-flex justify-center align-center h-100" style="min-height: 90vh">
    <v-card class="mx-auto text-center pa-4" width="100%" max-width="500" elevation="8" rounded="lg">
      <v-card-title class="text-h4 text-primary font-weight-bold mb-4">
        {{ t('router.onboarding') }}
      </v-card-title>
      <v-card-text>
        <p class="mb-6 text-body-1">
          {{ t('forms.formOnboarding.text') }}
        </p>

        <OnboardingForm :loading="loading" @submit="saveProfile" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import OnboardingForm from '@/components/forms/resources/OnboardingForm.vue'
import type { IOnboardingData } from '@/classes/models/ModelOnboardingData'
import { OnboardingService } from '@/services/security/onboardingService'
import { useSnackbar } from '@/composables/useSnackbar'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { notify } = useSnackbar()
const { t } = useI18n()

const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)

async function saveProfile(formData: IOnboardingData) {
  if (!authStore.user) return;

  try {
    loading.value = true;
    
    await OnboardingService.finalizarCadastro(authStore.user.id, formData);
    await authStore.fetchUser(authStore.user.id);

    notify('messages.forms.saveSuccess', 'success');
    router.push({ name: 'Home' });

  } catch (error) {
    notify(error, 'error');
  } finally {
    loading.value = false;
  }
}

</script>
