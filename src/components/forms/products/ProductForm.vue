<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense align="center">
      <v-col cols="12" md="5">
        <v-text-field
          v-model="product.productName"
          :rules="[rules.required(), rules.maxLength(100)]"
          :label="t('forms.formProduct.productName.label')"
          counter
          density="compact"
          variant="outlined"
          clearable
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-mask-input
          v-model="product.price"
          :rules="[rules.required()]"
          :options="currencyOptions"
          :label="t('forms.formProduct.price.label')"
          :hint="convertedHint"
          :placeholder="currencyPlaceholder"
          type="number"
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
      <v-col cols="12" md="3" class="d-flex justify-center">
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
        <InputCategoryWithSearch
          v-model:category="product.category"
          :label="t('forms.formProduct.category.label')"
          :hint="t('forms.formProduct.category.hint')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-row dense gap="2">
          <v-col cols="12" md="6">
            <v-number-input
              v-model="product.recipe.idRecipe"
              :label="t('forms.formProduct.recipe.label')"
              :hint="t('forms.formProduct.recipe.hint')"
              controlVariant="stacked"
              density="compact"
              variant="outlined"
              clearable
              inset
            >
              <template #prepend-inner>
                <v-icon-btn icon="mdi-silverware-variant" icon-color="info" variant="plain" />
              </template>
            </v-number-input>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              :model-value="product.recipe?.description"
              disabled
              density="compact"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="d-flex flex-column">
        <InputUploadImage
          v-model="product.imageFile"
          :label="t('forms.formProduct.image.label')"
        />
        <div v-if="product.image && !product.imageFile" class="mb-4 text-center">
          <v-img :src="product.image" aspect-ratio="16/9" cover class="rounded-lg mt-5" />
          <div class="text-caption">{{ t('forms.formProduct.image.label') }}</div>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import InputUploadImage from '../fixtures/InputUploadImage.vue'
import InputCategoryWithSearch from '../fixtures/InputCategoryWithSearch.vue'
import { type IProduct } from '@/classes/models/ModelIProduct'
import { useQuotationStore } from '@/stores/quotationStore'
import { BASE_CURRENCY, getCurrency } from '@/locales/definitionsLocales'
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

const rules = useRules()
const { t, locale } = useI18n()
const quotationStore = useQuotationStore()

const formRef = ref<any>(null)
const product = defineModel<IProduct>('product', { required: true })
const formIsValid = defineModel<boolean>('valid', { default: false })

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
    currency: BASE_CURRENCY,
  }).format(convertedValue)

  return `${t('forms.formProduct.price.hint')} ${formatted} ${BASE_CURRENCY}`
})

const currencyOptions = computed(() => {
  const parts = new Intl.NumberFormat(locale.value).formatToParts(1000.1)
  return {
    decimal: parts.find((p) => p.type === 'decimal')?.value,
    separator: parts.find((p) => p.type === 'group')?.value,
    prefix: '',
    precision: 2,
  }
})

const currencyPlaceholder = computed(() => {
  return new Intl.NumberFormat(locale.value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(0)
})

defineExpose({
  reset: () => formRef.value?.resetValidation(),
  validate: async () => {
    const { valid } = await formRef.value?.validate()
    return valid
  },
})

</script>
