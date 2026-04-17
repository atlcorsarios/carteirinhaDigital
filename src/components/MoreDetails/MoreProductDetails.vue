<template>
  <BaseMoreDetails @close="$emit('close')">
    <template #details>
      <CardProduto :produto="produto" />
    </template>
  </BaseMoreDetails>
</template>

<script setup lang="ts">
import BaseMoreDetails from './BaseMoreDetails.vue';
import CardProduto from '../cards/CardProduto.vue';
import type { IProdutosDetalhados } from '@/classes/models/resources/ModelIProdutos'

const props = defineProps<{
  produto: Partial<IProdutosDetalhados>
}>();

defineEmits(['close']);
</script>
