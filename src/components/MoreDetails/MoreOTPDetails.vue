<template>
  <BaseMoreDetails
    :title="otpCodeDetalhado.codigo"
    @close="$emit('close')"
  >
    <template #details>
      <CardOtpDetails :otp-code-detalhado="otpCodeDetalhado" />
    </template>
  </BaseMoreDetails>
</template>

<script setup lang="ts">
import BaseMoreDetails from './BaseMoreDetails.vue';
import CardOtpDetails from '../cards/CardOtpDetails.vue';
import type { IOTPCodeDetalhado } from '@/classes/models/resources/ModelIOTP';

const props = defineProps<{ otpCodeDetalhado: IOTPCodeDetalhado }>();
defineEmits(['close']);
</script>
