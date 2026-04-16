<template>
  {{ produto }}
</template>

<script setup lang="ts">
import type { IProdutos } from '@/classes/models/resources/ModelIProdutos';

defineProps<{
  produto: IProdutos
}>();

</script>
