<template>
  <v-text-field
    :model-value="plano?.nome || ''"
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
        icon="mdi-tab-search"
        icon-color="info"
        variant="plain"
        @click="handleSearchPlano"
      />
    </template>
  </v-text-field>

  <DialogSearchPlanos
    v-model:attributes="dialogSearchPlano"
    @select-item="onPlanoSelected"
  />
</template>

<script setup lang="ts">
import DialogSearchPlanos from '@/components/dialog/searchs/planos/DialogSearchPlanos.vue';
import type { IPropsCustomInputs } from '@/classes/models/modelComponents/ModelCustomInputs';
import type { IPlanos } from '@/classes/models/resources/ModelIPlanos';
import { ClassPlanos } from '@/classes/resources/ClassPlanos';
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

const { t } = useI18n();

const dialogSearchPlano = new ClassBaseDialog({
  maxWidth: 1200,
});

const plano = defineModel<IPlanos>('plano', { required: true });
const idPlano = defineModel<string | null>('idPlano');
withDefaults(defineProps<IPropsCustomInputs>(), {
  label: 'forms.formOTP.plano.label',
  density: 'compact',
  variant: 'outlined',
  disabled: false,
  rules: () => []
});

function handleSearchPlano() {
  dialogSearchPlano.model.view = true;
}

function onPlanoSelected(selectedItem: IPlanos) {
  plano.value = selectedItem
  idPlano.value = selectedItem.id || (selectedItem as any).id || null;
}

function clearResource() {
  plano.value = {
    ...ClassPlanos.defaultPlano(),
  }
  idPlano.value = null;
}

watch(() => plano.value?.id, (newId) => {
  if (!newId) {
    clearResource()
  }
});

</script>
