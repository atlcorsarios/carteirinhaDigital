<template>
  <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handleSubmit">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="user.username"
          :counter="30"
          :rules="[rules.required(), rules.maxLength(30)]"
          :label="t('forms.formUser.username.label')"
          :hint="t('forms.formUser.username.hint')"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="user.email"
          :counter="150"
          :rules="[rules.required(), rules.email(), rules.maxLength(150)]"
          :label="t('forms.formUser.email.label')"
          :hint="t('forms.formUser.email.hint')"
          persistent-hint
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete
          v-model="user.role"
          :rules="[rules.required()]"
          :items="roleOptions"
          :label="t('forms.formUser.role.label')"
          :filter-keys="['title', 'raw.abbr']"
          item-title="title"
          item-value="value"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-mask-input
          v-model="user.phoneNumber"
          mask="(##) #####-####"
          placeholder="(##) #####-####"
          :label="t('forms.formUser.phoneNumber.label')"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-switch
          v-model="user.receiveNotifications"
          :label="t('forms.formUser.receiveNotifications.label')"
          :indeterminate="user.receiveNotifications === null || user.receiveNotifications === undefined"
          color="success"
          class="m-0 p-0"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-switch
          v-model="user.active"
          :label="t('forms.formUser.active.label')"
          :indeterminate="user.active === null || user.active === undefined"
          color="success"
          class="m-0 p-0"
        />
      </v-col>
    </v-row>
    <button type="submit" class="d-none"></button>
  </v-form>
</template>

<script setup lang="ts">
import { ROLE_TRANSLATIONS, validRoles, type IUser } from '@/classes/models/ModelUser'
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

const rules = useRules()
const { t } = useI18n()

const formRef = ref<any>(null)
const user = defineModel<IUser>('user', { required: true })
const formIsValid = defineModel<boolean>('valid', { default: false })
const emit = defineEmits(['submit']);

const roleOptions = computed(() => {
  return validRoles.map((role) => ({
    title: t(ROLE_TRANSLATIONS[role]),
    value: role
  }));
});

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    emit('submit');
  }
}

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate()
    return valid
  },
});

</script>
