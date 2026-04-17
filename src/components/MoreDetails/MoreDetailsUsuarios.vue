<template>
  <BaseMoreDetails @close="$emit('close')">
    <template #details>
      <CardUsuario :usuario="usuario" />
    </template>
  </BaseMoreDetails>
</template>

<script setup lang="ts">
import CardUsuario from '../cards/CardUsuario.vue';
import BaseMoreDetails from './BaseMoreDetails.vue';

defineProps<{ usuario: any }>();
defineEmits(['close']);
</script>
