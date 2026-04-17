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
import { ref } from 'vue';

const fakeOtp = ref('');
const usuario = defineModel<IUser>('usuario', { required: true });

</script>
