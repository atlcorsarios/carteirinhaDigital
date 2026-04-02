<template>
  <div class="input-beneficios-container">
    <v-text-field
      :label="t(label)"
      :hint="t(hint)"
      :density="density"
      :variant="variant"
      readonly
    >
      <template #prepend-inner>
        <v-icon-btn
          icon="mdi-magnify"
          icon-color="info"
          variant="plain"
          @click="handleSearchBeneficio"
        />
      </template>
    </v-text-field>

    <v-chip-group column>
      <v-chip
        v-for="item in tempArray"
        :key="item.id"
        closable
        color="primary"
        variant="tonal"
        @click:close="removerBeneficio(item.id)"
      >
        <v-icon
          icon="mdi-star"
          size="small"
          class="mr-1"
        />
        {{ item.descricao_beneficio }} ({{ item.desconto_aplicavel }}%)
      </v-chip>
    </v-chip-group>

    <DialogSearchBeneficios
      v-model:selected-itens="tempArray"
      v-model:attributes="dialogSearchBeneficios"
    />
  </div>
</template>

<script setup lang="ts">
// Componentes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';
import DialogSearchBeneficios from '@/components/dialog/searchs/beneficios/DialogSearchBeneficios.vue'

// Models
import type { IPropsCustomInputs } from '@/classes/models/modelComponents/ModelCustomInputs';

// Vue
import { useI18n } from 'vue-i18n';
import { ref } from 'vue'

const { t } = useI18n();

const props = withDefaults(defineProps<IPropsCustomInputs>(), {
  label: 'forms.formPlano.beneficios.label',
  hint: 'forms.formPlano.beneficios.hint',
  density: 'compact',
  variant: 'outlined'
});

const tempArray = ref<any[]>([]);
const dialogSearchBeneficios = new ClassBaseDialog({
  maxWidth: 1200,
});

function handleSearchBeneficio() {
  dialogSearchBeneficios.toggleDialog()
}

function removerBeneficio(idParaRemover: string) {
  tempArray.value = tempArray.value.filter((b: any) => b.id !== idParaRemover)
}

</script>
