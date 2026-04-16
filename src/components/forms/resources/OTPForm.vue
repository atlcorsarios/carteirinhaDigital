<template>
  <InputPlano
    v-model:plano="otpCode.plano"
    v-model:idPlano="otpCode.plano_id"
  />

  <InputUsuario
    v-model:usuario="otpCode.usuario_destino"
    v-model:idUsuario="otpCode.usuario_destino_id"
  />
</template>

<script setup lang="ts">
import type { IOTPCodeDetalhado } from '@/classes/models/resources/ModelIOTP';
import InputPlano from '../fixtures/InputPlano.vue';
import InputUsuario from '../fixtures/InputUsuario.vue';

const otpCode = defineModel<IOTPCodeDetalhado>('otpCode', { required: true });
const emit = defineEmits(['submit']);

</script>
