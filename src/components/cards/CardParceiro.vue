<template>
  {{ parceiro }}
</template>

<script setup lang="ts">
import type { TParceiro } from '@/classes/models/resources/ModelUsuarios';

defineProps<{
  parceiro: TParceiro
}>();

</script>
