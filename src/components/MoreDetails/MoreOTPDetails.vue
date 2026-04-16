<template>
    <v-card>
    <v-card-title class="d-flex sticky-title bg-surface">
      <div class="text-h6 w-100 me-auto">
        {{ otpCodeDetalhado.codigo }}
      </div>

      <v-icon-btn
        icon="mdi-close"
        variant="text"
        color="info"
        v-tooltip="t('tooltips.forms.close')"
        @click="$emit('close')"
      />
    </v-card-title>
    <v-card-text>
      {{ otpCodeDetalhado }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ClassFormatters } from '@/classes/ClassFormatters';
import type { IOTPCodeDetalhado } from '@/classes/models/resources/ModelIOTP';
import { ref } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{ otpCodeDetalhado: IOTPCodeDetalhado }>();
defineEmits(['close']);

const loading = ref(true);

</script>
