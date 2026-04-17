<template>
  {{ usuario }}
</template>

<script setup lang="ts">
import type { IUser } from '@/classes/models/resources/ModelUsuarios';

const props = defineProps<{ usuario: IUser }>();
</script>
