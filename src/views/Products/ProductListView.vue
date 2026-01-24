<template>
  <BaseDialog v-model:attributes="classDialogProduct.model">
    <template v-slot:title>
      <v-icon
        size="small"
        class="mr-2"
        :icon="classDialogProduct.model.formEditingMode
          ? 'mdi-pencil-outline'
          : 'mdi-package-variant-closed-plus'"
      />
      {{
        classDialogProduct.model.formEditingMode
          ? t('messages.forms.formProduct.editingProduct') +
            ` ${classDialogProduct.model.itemEdition?.idProduct || ''}`
          : t('messages.forms.formProduct.createProduct')
      }}
    </template>

    <template v-slot:default>
      <ProductForm
        ref="refFormProduct"
        v-model:product="classProduct.model"
        v-model:valid="isFormValid"
      />
    </template>

    <template v-slot:actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="resetFormUser"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-package-variant-closed-check"
        v-tooltip="t('tooltips.forms.save')"
        variant="text"
        color="success"
        :disabled="!isFormValid"
        @click="submit"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/dialog/BaseDialog.vue';
import ProductForm from '@/components/forms/products/ProductForm.vue';
import type { IProduct } from '@/classes/models/ModelIProduct';
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';
import { ClassProducts } from '@/classes/products/ClassProducts';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n();

const classDialogProduct = new ClassBaseDialog<IProduct>({
  view: true,
  persistent: true,
  maxWidth: 1000,
  maxHeight: 600
})

const classProduct = new ClassProducts()
const refFormProduct = ref<InstanceType<typeof ProductForm> | null>(null)
const isFormValid = ref(false)


function resetFormUser() {
  refFormProduct.value?.reset()
  classProduct.reset()
}

function submit() {
  // Lógica de submit...
  classDialogProduct.toggleDialog()
}

</script>
