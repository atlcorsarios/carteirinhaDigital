<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense align="center">
      <v-col cols="12" :md="createFast ? 12 : 6">
        <v-text-field
          v-model="category.description"
          :rules="[rules.required(), rules.maxLength(100)]"
          :label="t('forms.formCategory.description.label')"
          density="compact"
          variant="outlined"
          counter
          clearable
        />
      </v-col>
      <v-col v-if="!createFast" cols="12" md="6">
        <v-autocomplete
          v-model="category.group"
          :rules="[rules.required()]"
          :items="groupOptions"
          :label="t('forms.formCategory.group.label')"
          :filter-keys="['title', 'raw.abbr']"
          item-title="title"
          item-value="value"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col v-if="!createFast" cols="12" class="d-flex justify-center">
        <v-switch
          v-model="category.active"
          :label="t('forms.formCategory.active.label')"
          :indeterminate="category.active === null || category.active === undefined"
          color="success"
          class="m-0 p-0"
        />
      </v-col>
    </v-row>
    <slot name="actions" />
  </v-form>
</template>

<script setup lang="ts">
import { GROUP_TRANSLATIONS, validCategoriesGroups, type ICategory } from '@/classes/models/ModelIProduct';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue'

const rules = useRules();
const { t } = useI18n();

withDefaults(defineProps<{
  createFast?: boolean
}>(), {
  createFast: false
})

const formRef = ref<any>(null);
const category = defineModel<ICategory>('category', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

const groupOptions = computed(() => {
  return validCategoriesGroups.map((group) => ({
    title: t(GROUP_TRANSLATIONS[group]),
    value: group
  }));
});

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  }
});
</script>
