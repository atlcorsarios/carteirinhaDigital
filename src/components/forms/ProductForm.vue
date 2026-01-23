<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense align="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="product.productName"
          :rules="[rules.required(), rules.maxLength(100)]"
          :label="t('forms.formProduct.productName.label')"
          density="compact"
          variant="outlined"
          counter
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-mask-input
          v-model="product.price"
          :options="currencyOptions"
          :label="t('forms.formProduct.price.label')"
          :hint="convertedHint"
          :placeholder="currencyPlaceholder"
          density="compact"
          variant="outlined"
          clearable
        >
          <template #prepend-inner>
            <span class="text-caption font-weight-bold text-medium-emphasis mr-1 mt-1">
              {{ coinCode }}
            </span>
            <v-divider vertical class="mx-2 my-1" />
          </template>
        </v-mask-input>
      </v-col>
      <v-col cols="12" md="2" class="d-flex justify-center">
        <v-checkbox
          v-model="product.active"
          :label="t('forms.formProduct.active.label')"
          color="success"
          class="m-0 p-0"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="product.category.id"
          density="compact"
          variant="outlined"
        >
          <template #prepend-inner>
            <v-icon-btn
              icon="mdi-tag-search"
              icon-color="info"
              variant="plain"
            />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="product.recipe.id"
          density="compact"
          variant="outlined"
        >
          <template #prepend-inner>
            <v-icon-btn
              icon="mdi-silverware-variant"
              icon-color="info"
              variant="plain"
            />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" class="d-flex flex-column">
        <InputUploadImage
          v-model="product.imageFile"
          :label="t('forms.formProduct.image.label')"
        />
        <div v-if="product.image && !product.imageFile" class="mb-4 text-center">
          <v-img
            :src="product.image"
            aspect-ratio="16/9"
            cover
            class="rounded-lg mt-5"
          />
          <div class="text-caption">{{ t('forms.formProduct.image.label') }}</div>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import InputUploadImage from './fixtures/InputUploadImage.vue';
import { type IProduct } from '@/classes/models/ModelIProduct';
import { useQuotationStore } from '@/stores/quotationStore';
import { BASE_CURRENCY, getCurrency } from '@/locales/definitionsLocales';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

const quotationStore = useQuotationStore()
const rules = useRules();
const { t, locale } = useI18n();

const formRef = ref<any>(null);
const product = defineModel<IProduct>('product', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

const coinCode = computed(() => {
  return getCurrency(locale.value)
})

const convertedHint = computed(() => {
  const value = product.value.price
  if (!value || !coinCode.value) return ''

  const currentCurrency = coinCode.value
  let convertedValue = 0

  if (currentCurrency != BASE_CURRENCY) {
    convertedValue = quotationStore.convertToBaseFrom(value, currentCurrency)
  } else {
    convertedValue = value
  }

  const formatted = new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: BASE_CURRENCY
  }).format(convertedValue)

  return `${t('forms.formProduct.price.hint')} ${formatted} ${BASE_CURRENCY}`
})

const currencyOptions = computed(() => {
  const parts = new Intl.NumberFormat(locale.value).formatToParts(1000.1)

  return {
    decimal: parts.find(p => p.type === 'decimal')?.value,
    separator: parts.find(p => p.type === 'group')?.value,
    prefix: '',
    precision: 2,
  }
})

const currencyPlaceholder = computed(() => {
  return new Intl.NumberFormat(locale.value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(0)
})

defineExpose({
  reset: () => formRef.value?.resetValidation(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  }
});

</script>
