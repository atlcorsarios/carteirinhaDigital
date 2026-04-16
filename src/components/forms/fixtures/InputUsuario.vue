<template>
  <v-text-field
    :model-value="usuario?.email || ''"
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

  <DialogSearchUsuarios
    v-model:attributes="dialogSearchPlano"
    @select-item="onUsuarioSelected"
  />
</template>

<script setup lang="ts">
import DialogSearchUsuarios from '@/components/dialog/searchs/DialogSearchUsuarios.vue';
import type { IPropsCustomInputs } from '@/classes/models/modelComponents/ModelCustomInputs';
import type { IUser } from '@/classes/models/resources/ModelUsuarios';
import { ClassUsuarios } from '@/classes/resources/ClassUsuarios';
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

const { t } = useI18n();

const dialogSearchPlano = new ClassBaseDialog({
  maxWidth: 1200,
});

const usuario = defineModel<IUser>('usuario', { required: true });
const idUsuario = defineModel<string | null>('idUsuario');
withDefaults(defineProps<IPropsCustomInputs>(), {
  label: 'forms.formOTP.usuarioDestino.label',
  density: 'compact',
  variant: 'outlined',
  disabled: false,
  rules: () => []
});

function handleSearchPlano() {
  dialogSearchPlano.model.view = true;
}

function onUsuarioSelected(selectedItem: IUser) {
  usuario.value = selectedItem
  idUsuario.value = selectedItem.id || (selectedItem as any).id || null;
}

function clearResource() {
  usuario.value = {
    ...ClassUsuarios.defaultUser(),
  }
  idUsuario.value = null;
}

watch(() => usuario.value?.id, (newId) => {
  if (!newId) {
    clearResource()
  }
});

</script>
