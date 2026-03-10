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
      <InputCategoryWithSearch
        v-model:category="product.category"
        :label="t('forms.formProduct.category.label')"
        :hint="t('forms.formProduct.category.hint')"
      />

      <InputRecipeWithSearch
        v-model:recipe="product.recipe"
        :label="t('forms.formProduct.recipe.label')"
        :hint="t('forms.formProduct.recipe.hint')"
      />

      <v-col cols="12" class="d-flex flex-column">
        <InputUploadImage v-model="product.imageFile" :label="t('forms.formProduct.image.label')" />
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
import InputCategoryWithSearch from '../fixtures/InputCategoryWithSearch.vue'
import InputRecipeWithSearch from '../fixtures/InputRecipeWithSearch.vue'
import InputUploadImage from '../fixtures/InputUploadImage.vue'
import InputPrice from '../fixtures/InputPrice.vue'

// Models
import { type IProduct } from '@/classes/models/ModelIProduct'

// Vue
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const rules = useRules()
const { t } = useI18n()

const formRef = ref<any>(null)
const product = defineModel<IProduct>('product', { required: true })
const formIsValid = defineModel<boolean>('valid', { default: false })
const emit = defineEmits(['submit']);

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    emit('submit');
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
