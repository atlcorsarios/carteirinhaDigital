<template>
  <InputBeneficios />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputBeneficios from '../fixtures/InputBeneficios.vue';
import { useRules } from 'vuetify/labs/rules';

const { t } = useI18n();
const rules = useRules();

</script>
