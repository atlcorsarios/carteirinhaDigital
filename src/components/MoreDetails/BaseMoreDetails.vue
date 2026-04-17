<template>
  <v-card>
    <v-card-title class="d-flex sticky-title bg-surface">
      <div class="text-h6 w-100 me-auto">
        <slot name="title">{{ title ? t(title) : '' }}</slot>
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
      <slot name="details">DETAILS</slot>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  title?: string
}>();

defineEmits(['close']);

</script>
