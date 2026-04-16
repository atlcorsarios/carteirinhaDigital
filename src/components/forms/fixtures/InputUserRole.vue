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
import { ROLE_TRANSLATIONS, validRoles, type IUser, type TRole } from '@/classes/models/resources/ModelUsuarios';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const rules = useRules();
const authStore = useAuthStore();
const { te, t } = useI18n();

const role = defineModel<TRole>('role', { required: true });
const otp = defineModel<string>('otp');
const props = withDefaults(defineProps<IPropsCustomInputs & { user: Partial<IUser> }>(), {
  label: 'forms.formUser.cargo.label',
  density: 'compact',
  variant: 'outlined',
  disabled: false
});

const originalRole = ref('');

watch(() => props.user?.id, (newId) => {
  if (newId) {
    originalRole.value = props.user?.cargo || 'aluno';
  }
}, { immediate: true });

const computedLabel = computed(() => te(props.label) ? t(props.label) : props.label);

const conditionRequiredOTP = computed(() => {
  const requiresValidationRoles = ['diretoria', 'associado'];
  if (!requiresValidationRoles.includes(role.value)) {
    return false;
  }

  const isNewUser = !props.user?.id;
  if (isNewUser) {
    return true;
  }

  const isEditingSelf = authStore.userProfile?.id === props.user?.id;

  if (isEditingSelf) {
    return role.value !== authStore.userProfile?.cargo;
  }

  return role.value !== originalRole.value;
});

const ruleOTPCargo = computed(() => {
  if (conditionRequiredOTP.value) return [rules.required()]
  return []
});

const roleOptions = computed(() => {
  return validRoles.map((role) => ({
    title: t(ROLE_TRANSLATIONS[role]),
    value: role,
  }))
});

</script>
