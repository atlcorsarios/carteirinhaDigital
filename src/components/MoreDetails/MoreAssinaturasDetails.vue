<template>
  <BaseMoreDetails @close="$emit('close')">
    <template #details>
      <CardAssinaturas :assinatura="assinatura" />
    </template>
  </BaseMoreDetails>
</template>

<script setup lang="ts">
import BaseMoreDetails from './BaseMoreDetails.vue';
import CardAssinaturas from '../cards/CardAssinaturas.vue';
import type { IAssinaturasDetalhadas } from '@/classes/models/resources/ModelIAssinaturas'

const props = defineProps<{ assinatura: IAssinaturasDetalhadas }>();
defineEmits(['close']);

</script>
