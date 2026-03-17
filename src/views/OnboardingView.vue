<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="600" elevation="8" rounded="lg" class="pa-6 text-center">
      <v-card-title class="text-h4 text-primary font-weight-bold mb-4">
        Quase lá!
      </v-card-title>
      <v-card-text>
        <p class="mb-6 text-body-1">
          Precisamos de mais alguns dados para finalizar o seu cadastro e preparar o seu ambiente.
        </p>

        <OnboardingForm :loading="loading" :owner-bucket="ownerBucket" @submit="saveProfile" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import OnboardingForm from '@/components/forms/resources/OnboardingForm.vue'
import type { IOnboardingData } from '@/classes/models/ModelOnboardingData'
import { OnboardingService } from '@/services/onboardingService'
import { sanitizeName } from '@/utils/sanitizeForBucket'
import { useSnackbar } from '@/composables/useSnackbar'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const { notify } = useSnackbar()
const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)

const ownerBucket = computed(() => {
  const idUser = authStore.user?.id
  if (idUser == undefined) throw new Error('id undefined')
  return sanitizeName(idUser);
})

async function saveProfile(formData: IOnboardingData) {
  if (!authStore.user) return;

  try {
    loading.value = true;
    
    await OnboardingService.finalizarCadastro(authStore.user.id, formData);
    await authStore.fetchUser(authStore.user.id);

    notify('Perfil atualizado com sucesso!', 'success');
    router.push({ name: 'Home' });

  } catch (error) {
    notify(error, 'error');
  } finally {
    loading.value = false;
  }
}

</script>
