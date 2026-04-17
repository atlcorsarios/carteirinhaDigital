<template>
  <BaseMoreDetails @close="$emit('close')">
    <template #details>
      <CardPlano :plano="plano" />
    </template>
  </BaseMoreDetails>
</template>

<script setup lang="ts">
import BaseMoreDetails from './BaseMoreDetails.vue';
import CardPlano from '../cards/CardPlano.vue';
import type { IPlanos } from '@/classes/models/resources/ModelIPlanos';

defineProps<{ plano: IPlanos }>();
</script>
