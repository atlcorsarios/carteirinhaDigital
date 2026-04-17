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
        v-for="(item, index) in uniqueBeneficios"
        :key="getBenData(item).id || index"
        closable
        color="primary"
        variant="tonal"
        @click:close="removerBeneficio(item)"
      >
        <v-icon
          icon="mdi-star"
          size="small"
          class="mr-1"
        />
        {{ getBenData(item).descricao_beneficio }} ({{ getBenData(item).desconto_aplicavel }}%)
      </v-chip>
    </v-chip-group>

    <DialogSearchBeneficios
      v-model:selected-itens="beneficiosFlat"
      v-model:attributes="dialogSearchBeneficios"
      @select-item="onBeneficioSelected"
    />
  </div>
</template>

<script setup lang="ts">
// Componentes
import DialogSearchBeneficios from '@/components/dialog/searchs/beneficios/DialogSearchBeneficios.vue'

// Models
import type { IPropsCustomInputs } from '@/classes/models/modelComponents/ModelCustomInputs';

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';

// Vue
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();

const props = withDefaults(defineProps<IPropsCustomInputs>(), {
  label: 'forms.formPlanos.beneficios.label',
  hint: 'forms.formPlanos.beneficios.hint',
  density: 'compact',
  variant: 'outlined'
});

const beneficios = defineModel<any[]>({ default: () => [] });

const dialogSearchBeneficios = new ClassBaseDialog({
  maxWidth: 1200,
});

const getBenData = (item: any) => item.beneficios || item;

const uniqueBeneficios = computed(() => {
  const map = new Map();
  beneficios.value.forEach(item => {
    const data = getBenData(item);
    if (data && data.id) {
      map.set(data.id, data);
    }
  });
  return Array.from(map.values());
});

const beneficiosFlat = computed({
  get: () => uniqueBeneficios.value,
  set: (newArray) => {
    const map = new Map();
    newArray.forEach(item => {
      const data = getBenData(item);
      if (data && data.id) map.set(data.id, item);
    });
    beneficios.value = Array.from(map.values());
  }
});

function handleSearchBeneficio() {
  dialogSearchBeneficios.toggleDialog()
}

function removerBeneficio(itemToRemove: any) {
  const idToRemove = itemToRemove.id;
  beneficios.value = beneficios.value.filter(b => getBenData(b).id !== idToRemove);
}

function onBeneficioSelected(selectedItem: any) {
  const data = getBenData(selectedItem);
  if (!data || !data.id) return;
  const exists = beneficios.value.some(b => getBenData(b).id === data.id);

  if (exists) {
    removerBeneficio(data);
  } else {
    beneficios.value.push(selectedItem);
  }
}

</script>
