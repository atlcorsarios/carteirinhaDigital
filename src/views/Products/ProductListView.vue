<template>
  <ProductForm
    ref="refFormProduct"
    v-model:product="classProduct.model"
    v-model:valid="isFormValid"
  />
</template>

<script setup lang="ts">
import { ClassProducts } from '@/classes/products/ClassProducts';
import ProductForm from '@/components/forms/ProductForm.vue';
import { ref } from 'vue';

const classProduct = new ClassProducts()
const refFormProduct = ref<InstanceType<typeof ProductForm> | null>(null)
const isFormValid = ref(false)

</script>
