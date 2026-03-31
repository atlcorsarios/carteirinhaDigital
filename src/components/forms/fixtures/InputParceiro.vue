<template>
  <v-text-field
    v-model="parceiro"
    :rules="rules"
    :label="t(label)"
    :density="density"
    :variant="variant"
    readonly
    clearable
    @click:clear="clearResource"
  >
    <template #prepend-inner>
      <v-icon-btn
        icon="mdi-account-search"
        icon-color="info"
        variant="plain"
        @click="handleSearchParceiro"
      />
    </template>
  </v-text-field>

  <DialogSearchParceiro
    v-model:attributes="dialogSearchParceiro"
    @select-item="onParceiroSelected"
  />
</template>

<script setup lang="ts">
import DialogSearchParceiro from '@/components/dialog/searchs/DialogSearchParceiro.vue';
import type { IPropsCustomInputs } from '@/classes/models/modelComponents/ModelCustomInputs';
import type { TParceiro } from '@/classes/models/resources/ModelUser';
import { ClassParceiros } from '@/classes/resources/ClassParceiros';
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

const { t } = useI18n();

const dialogSearchParceiro = new ClassBaseDialog({
  maxWidth: 600,
});

const parceiro = defineModel<TParceiro | null>('parceiro');
const idParceiro = defineModel<string | null>('idParceiro');
withDefaults(defineProps<IPropsCustomInputs>(), {
  label: 'forms.formProduct.parceiro.label',
  density: 'compact',
  variant: 'outlined',
  disabled: false,
  rules: () => []
});

function handleSearchParceiro() {
  dialogSearchParceiro.model.view = true;
}

function onParceiroSelected(selectedItem: TParceiro) {
  parceiro.value = selectedItem
  idParceiro.value = String(selectedItem.id_usuario);
}

function clearResource() {
  parceiro.value = {
    ...ClassParceiros.defaultParceiro(),
  }
  idParceiro.value = null;
}

watch(() => parceiro.value?.id_usuario, (newId) => {
  if (!newId) {
    clearResource()
  }
});

</script>
