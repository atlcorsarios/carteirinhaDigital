<template>
  <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handleSubmit">
    <v-row dense align="center">
      <v-col cols="12" md="5">
        <v-text-field
          v-model="product.description"
          :rules="[rules.required(), rules.maxLength(100)]"
          :label="t('forms.formProduct.description.label')"
          counter
          density="compact"
          variant="outlined"
          clearable
        />
      </v-col>

      <v-col cols="12" md="4">
        <InputPrice
          v-model="product.price"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col cols="12" md="3" class="d-flex justify-center">
        <v-switch
          v-model="product.active"
          :label="t('forms.formProduct.active.label')"
          :indeterminate="product.active === null || product.active === undefined"
          color="success"
          class="m-0 p-0"
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" class="d-flex flex-column">
        <InputUploadImage
          v-model="product.imageFile"
          :label="t('forms.formProduct.image.label')"
          :bucket="'produtos'"
          :owner="ownerBucket"
        />

        <div v-if="product.image && !product.imageFile" class="mb-4 text-center">
          <v-img :src="product.image" aspect-ratio="16/9" cover class="rounded-lg mt-5" />
          <div class="text-caption">{{ t('forms.formProduct.image.label') }}</div>
        </div>
      </v-col>
    </v-row>
    <button type="submit" class="d-none"></button>
  </v-form>
</template>

<script setup lang="ts">
// Componentes
import InputUploadImage from '../fixtures/InputUploadImage.vue'
import InputPrice from '../fixtures/InputPrice.vue'

// Models
import { type IProduct } from '@/classes/models/resources/ModelIProduct'

// Utils
import { sanitizeName } from '@/utils/sanitizeForBucket'

// Stores
import { useAuthStore } from '@/stores/authStore'

// Vue
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

const { t } = useI18n()
const rules = useRules()
const authStore = useAuthStore()

const formRef = ref<any>(null)
const product = defineModel<IProduct>('product', { required: true })
const formIsValid = defineModel<boolean>('valid', { default: false })
const emit = defineEmits(['submit'])

const ownerBucket = computed(() => {
  const idUser = authStore.user?.id
  if (idUser == undefined) throw new Error('id undefined')
  return sanitizeName(idUser);
})

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    emit('submit')
  }
}

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate()
    return valid
  },
})
</script>
