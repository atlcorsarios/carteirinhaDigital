<template>
  <v-container fluid class="fill-height d-flex justify-center">
    <div style="width: 100%; max-width: 800px;">
      <ProfileForm
        v-if="perfil"
        v-model:profile="perfil"
        v-model:otp="otp"
        :loading="loading"
        @submit="salvarPerfil"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import ProfileForm from '@/components/forms/resources/ProfileForm.vue';
import type { IUser } from '@/classes/models/resources/ModelUsuarios';
import { profileServices } from '@/services/resources/perfilService';
import { useAuthStore } from '@/stores/authStore';
import { useSnackbar } from '@/composables/useSnackbar';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const { notify } = useSnackbar();

const perfil = ref<IUser | null>(null);
const loading = ref(false);
const otp = ref('');

const loadProfile = () => {
  const user = authStore.userProfile;
  if (!user) return;

  perfil.value = {
    id: user.id,
    email: user.email ?? '',
    username: user.username ?? '',
    avatar_url: user.avatar_url ?? '',
    celular_contato: user.celular_contato,
    documento: user.documento,
    cargo: user.cargo ?? 'aluno',
    usuario_ativo: user.usuario_ativo ?? false,
  };
};

async function salvarPerfil() {
  if (!perfil.value || !authStore.user) return

  try {
    loading.value = true

    await profileServices.salvarDadosUsuario(authStore.user.id, {
      ...perfil.value,
      codigo_otp: otp.value
    })

    await authStore.fetchUser(authStore.user.id)
    notify('messages.forms.saveSuccess', 'success')

  } catch (error: any) {
    notify(error, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile();
});

</script>
