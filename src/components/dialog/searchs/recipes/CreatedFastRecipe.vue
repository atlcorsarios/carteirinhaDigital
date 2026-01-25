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
      <RecipeForm
        ref="refFormRecipe"
        v-model:recipe="classRecipe.model"
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
import BaseDialog from '../../BaseDialog.vue';
import RecipeForm from '@/components/forms/products/RecipeForm.vue';
import { type IRecipe } from '@/classes/models/ModelIProduct';
import { ClassRecipes } from '@/classes/products/ClassRecipes';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n()

const classDialogCreateRecipe = defineModel<any>('dialog-create-quickly', { required: true })

const classRecipe = new ClassRecipes()
const refFormRecipe = ref<InstanceType<typeof RecipeForm> | null>(null)
const isFormValid = ref<boolean>(false)

const emits = defineEmits<{
  (e: 'created-fast-item', item: IRecipe): void
}>()

function resetFormRecipe() {
  refFormRecipe.value?.reset()
  classRecipe.reset()
}

function handleCreateFastItem() {
  // simular a criação com método post, depois vai enviar com id
  const idRecipeCreated = 1
  emits('created-fast-item', { ...classRecipe.model, idRecipe: idRecipeCreated })
  classDialogCreateRecipe.value.toggleDialog()
}
</script>
