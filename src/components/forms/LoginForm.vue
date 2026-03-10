<template>
  <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handleSubmit">
    <v-row dense class="d-flex justify-center">
      <v-col cols="11">
        <v-text-field
          v-model="loginForm.email"
          :rules="[rules.required(), rules.email()]"
          :label="t('forms.formLogin.email.label')"
          density="compact"
          variant="outlined"
          clearable
        />
      </v-col>

      <v-col cols="11">
        <v-text-field
          v-model="loginForm.password"
          :rules="[rules.required()]"
          :type="showPassword ? 'text' : 'password'"
          :label="t('forms.formLogin.password.label')"
          density="compact"
          variant="outlined"
          clearable
        >
          <template v-slot:append-inner>
            <v-icon-btn
              :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click="showPassword = !showPassword"
              density="compact"
              variant="text"
            />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <button type="submit" class="d-none"></button>
    <slot name="actions" />
  </v-form>
</template>

<script setup lang="ts">
import type { ILogin } from '@/classes/models/ModelLogin'
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const showPassword = ref(false)
const rules = useRules()
const { t } = useI18n()

const formRef = ref<any>(null)
const loginForm = defineModel<ILogin>('login', { required: true })
const formIsValid = defineModel<boolean>('valid', { default: false })

const emit = defineEmits(['submit']);

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    emit('submit');
  }
}

defineExpose({
  reset: () => formRef.value?.resetValidation(),
  validate: async () => {
    const { valid } = await formRef.value?.validate()
    return valid
  },
})
</script>
