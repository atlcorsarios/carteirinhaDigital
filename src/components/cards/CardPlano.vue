<template>
  {{ plano }}
</template>

<script setup lang="ts">
import type { IPlanosDetalhados } from '@/classes/models/resources/ModelIPlanos';

defineProps<{
  plano: IPlanosDetalhados
}>();

</script>
