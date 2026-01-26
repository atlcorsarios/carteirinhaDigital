<template>
  <BaseDialog v-model:attributes="classDialogCreateRecipe.model">
    <template v-slot:title>
      <v-icon
        icon="mdi-cookie-plus"
        size="small"
        class="mr-2"
      />
      {{ t('messages.forms.formRecipe.createRecipe') }}
    </template>

    <template v-slot:default>
      <IngredientForm
        ref="refFormIngredient"
        v-model:ingredient="classIngredient.model"
        v-model:valid="isFormValid"
        :create-fast="true"
      />
    </template>

    <template v-slot:actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="resetFormRecipe"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-cookie-check"
        v-tooltip="t('tooltips.forms.save')"
        variant="text"
        color="success"
        :disabled="!isFormValid"
        @click="handleCreateFastItem"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Componentes
import IngredientForm from '@/components/forms/products/IngredientForm.vue';
import BaseDialog from '../../BaseDialog.vue';

// Models
import { type IIngredient } from '@/classes/models/ModelIProduct';

// Classes
import { ClassIngredients } from '@/classes/products/ClassIngredients';

// Vue
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n()

const classDialogCreateRecipe = defineModel<any>('dialog-create-quickly', { required: true })
const classIngredient = new ClassIngredients()
const refFormIngredient = ref<InstanceType<typeof IngredientForm> | null>(null)
const isFormValid = ref<boolean>(false)

const emits = defineEmits<{
  (e: 'created-fast-item', item: IIngredient): void
}>()

function resetFormRecipe() {
  refFormIngredient.value?.reset()
  classIngredient.reset()
}

function handleCreateFastItem() {
  // simular a criação com método post, depois vai enviar com id
  const idIngredientCreated = 1
  emits('created-fast-item', { ...classIngredient.model, idIngredient: idIngredientCreated })
  classDialogCreateRecipe.value.toggleDialog()
}
</script>
