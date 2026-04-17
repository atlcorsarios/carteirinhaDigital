<template>
  <CardAssinaturas :assinatura="assinatura" />
</template>

<script setup lang="ts">
import CardAssinaturas from '../cards/CardAssinaturas.vue';
import type { IAssinaturasDetalhadas } from '@/classes/models/resources/ModelIAssinaturas'

const props = defineProps<{ assinatura: IAssinaturasDetalhadas }>();
defineEmits(['close']);
</script>
