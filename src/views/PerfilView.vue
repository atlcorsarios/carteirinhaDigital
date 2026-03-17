<template>
  <v-container fluid class="fill-height d-flex justify-center">
    <ProfileForm
      v-if="userProfile"
      v-model:profile="userProfile"
      :loading="loading"
      @submit="salvarPerfil"
    />
  </v-container>
</template>

<script setup lang="ts">
import ProfileForm from '@/components/forms/resources/ProfileForm.vue';
import type { IUser } from '@/classes/models/resources/ModelUser';
import { useAuthStore } from '@/stores/authStore';
import { ref, onMounted } from 'vue';
import { OnboardingService } from '@/services/onboardingService';

const authStore = useAuthStore();
const userProfile = ref<IUser | null>(null);
const loading = ref(false);

const loadProfile = () => {
  const user = authStore.userProfile;
  if (!user) return;

  userProfile.value = {
    id: Number(user.id),
    email: user.email ?? '',
    username: user.username ?? '',
    avatar_url: user.avatar_url ?? '',
    celular_contato: user.celular_contato,
    documento: user.documento,
    cargo: user.cargo ?? 'aluno',
    usuario_ativo: user.usuario_ativo ?? false
  };
};

async function salvarPerfil() {
  if (!userProfile.value) return;

  console.log("Dados prontos para salvar:", userProfile.value)
  OnboardingService.finalizarCadastro
}

onMounted(() => {
  loadProfile();
});

</script>
