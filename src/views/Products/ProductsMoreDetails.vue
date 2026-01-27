<template>
  {{ product }}
  <v-card>
    <v-card-title
      
    >

    </v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import type { IProduct } from '@/classes/models/ModelIProduct';

const product = defineModel<IProduct>('product', { required: true })
</script>
