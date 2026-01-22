<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense align="center">
      <v-col cols="12" class="mb-3">
        <v-text-field
          v-model="product.productName"
          :rules="[rules.required(), rules.maxLength(100)]"
          :label="t('')"
          :hint="t('')"
          density="compact"
          variant="outlined"
          counter
          clearable
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { type IProduct } from '@/classes/models/ModelIProduct';
import type { ClassProducts } from '@/classes/products/ClassProducts';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const props = defineProps<{
  productManager: ClassProducts
}>();

const rules = useRules();
const { t } = useI18n();

const formRef = ref<any>(null);
const product = defineModel<IProduct>('product', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

defineExpose({
  reset: () => formRef.value?.resetValidation(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  }
});

</script>
