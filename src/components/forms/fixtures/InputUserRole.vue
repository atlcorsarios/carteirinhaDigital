<template>
  <v-autocomplete
    v-model="role"
    :rules="[rules.required()]"
    :items="roleOptions"
    :label="computedLabel"
    :density="density"
    :variant="variant"
    :filter-keys="['title', 'raw.abbr']"
    item-title="title"
    item-value="value"
    :disabled="disabled"
  />

  <v-mask-input v-if="conditionRequiredOTP"
    v-model="otp"
    :rules="ruleOTPCargo"
    :mask="'######'"
    :label="t('forms.formUser.codigo.label')"
    :density="density"
    :variant="variant"
    clearable
  />
</template>

<script setup lang="ts">
import type { IPropsCustomInputs } from '@/classes/models/modelComponents/ModelCustomInputs';
import { ROLE_TRANSLATIONS, validRoles, type TRole } from '@/classes/models/resources/ModelUser';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const rules = useRules()
const authStore = useAuthStore();
const { te, t } = useI18n();

const role = defineModel<TRole>('role', { required: true });
const otp = defineModel<string>('otp');
const props = withDefaults(defineProps<IPropsCustomInputs>(), {
  label: 'forms.formUser.cargo.label',
  density: 'compact',
  variant: 'outlined',
  disabled: false
})

const computedLabel = computed(() => te(props.label) ? t(props.label) : props.label)
const conditionRequiredOTP = computed(() => {
  const isTargetRole = role.value === 'diretoria' || role.value === 'associado';
  const isDifferentFromCurrent = role.value !== authStore.userProfile?.cargo;
  return isTargetRole && isDifferentFromCurrent;
});
const ruleOTPCargo = computed(() => {
  if (conditionRequiredOTP.value) return [rules.required()]
  return []
})

const roleOptions = computed(() => {
  return validRoles.map((role) => ({
    title: t(ROLE_TRANSLATIONS[role]),
    value: role,
  }))
})

</script>
