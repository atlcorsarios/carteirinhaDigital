<template>
  <BaseDialog v-model:attributes="attributes.model">
    <template v-slot:title>
      <v-icon
        icon="mdi-information-variant-circle-outline"
        size="small"
      />
      {{ t('app.cardInfoLicence') }}
    </template>

    <template v-slot:default>
      <v-list dense>
        <v-list-item
          :title="t('app.version') + ': ' + systemVersion"
          :subtitle="t('app.updateDate') + ': ' + formattedVersionDate"
        >
          <template v-slot:prepend>
            <v-icon
              icon="mdi-code-block-tags"
              size="x-large"
              color="info"
              class="mr-3"
            />
          </template>
        </v-list-item>

        <v-list-item
          :title="t('app.software')"
          :subtitle="t('app.title')"
        >
          <template v-slot:prepend>
            <v-icon
              icon="mdi-license"
              size="x-large"
              color="warning"
              class="mr-3"
            />
          </template>
        </v-list-item>
      </v-list>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import pkg from '../../../package.json'
import BaseDialog from './BaseDialog.vue';
import { formattedDate } from '@/utils/formattedDate';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';

const { t, locale } = useI18n();

const attributes = defineModel<ClassBaseDialog>('attributes', { required: true });

const systemVersion = pkg.version;

const formattedVersionDate = computed(() => {
  return formattedDate(new Date(__APP_BUILD_DATE__), locale.value)
});

</script>
