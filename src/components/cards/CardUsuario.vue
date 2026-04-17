<template>
  <v-row dense class="d-flex justify-center">
    <v-col cols="6">
      <ProfileForm
        v-model:profile="usuario"
        v-model:otp="fakeOtp"
        readonly
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { IUser } from '@/classes/models/resources/ModelUsuarios';
import ProfileForm from '../forms/resources/ProfileForm.vue';
import { computed, ref } from 'vue';

const fakeOtp = ref('');
const rawData = defineModel<any>('usuario', { required: true });

const usuario = computed<IUser>({
  get: () => {
    const data = rawData.value;

    if (!data) return {} as IUser;

    if (data.usuarios) {
      return {
        email: data.usuarios.email || '',
        username: data.nome_fantasia || data.usuarios.username || '',
        avatar_url: data.usuarios.avatar_url || '',
        celular_contato: data.usuarios.celular_contato || '',
        documento: data.usuarios.documento || '',
        cargo: data.cargo || 'parceiro',
        usuario_ativo: data.ativo ?? data.usuarios.usuario_ativo ?? false,
      } as IUser;
    }

    return {
      email: data.email || '',
      username: data.username || '',
      avatar_url: data.avatar_url || '',
      celular_contato: data.celular_contato || '',
      documento: data.documento || '',
      cargo: data.cargo || 'usuario',
      usuario_ativo: data.usuario_ativo ?? false
    } as IUser;
  },

  set: () => {}
});

</script>
