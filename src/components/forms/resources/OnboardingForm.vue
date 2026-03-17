<template>
  <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
    <InputUploadImage
      v-model:url="formData.avatar_url"
      :bucket="'avatars'"
      :owner="ownerBucket"
      class="mb-5"
    />

    <v-select
      v-model="formData.cargo"
      :rules="[rules.required()]"
      :items="cargosDisponiveis"
      item-title="label"
      item-value="value"
      label="Como você vai usar o sistema?"
      variant="outlined"
      density="comfortable"
    />

    <v-mask-input
      v-if="formData.cargo === 'diretoria'"
      v-model="formData.codigo_otp"
      :rules="ruleOTPCargo"
      :mask="'######'"
      label="Código de verificação do cargo"
      variant="outlined"
      density="comfortable"
    />

    <v-mask-input
      v-model="formData.documento"
      :rules="[rules.required()]"
      :mask="maskDocumento"
      label="CPF / CNPJ"
      variant="outlined"
      density="comfortable"
    />

    <v-mask-input
      v-model="formData.celular_contato"
      :rules="[rules.required()]"
      :mask="maskCelular"
      label="Celular (WhatsApp)"
      variant="outlined"
      density="comfortable"
    />

    <v-btn
      color="primary"
      size="large"
      block
      type="submit"
      :loading="loading"
      class="mt-4"
    >
      Finalizar Cadastro
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import InputUploadImage from '@/components/forms/fixtures/InputUploadImage.vue'
import { useRules } from 'vuetify/labs/rules'
import { ref, computed } from 'vue'

const props = defineProps<{
  loading: boolean
  ownerBucket: string
}>()

const emit = defineEmits<{
  (e: 'submit', payload: typeof formData.value): void
}>()

const rules = useRules()
const formRef = ref()
const isValid = ref(false)

const formData = ref({
  avatar_url: '',
  cargo: 'aluno',
  codigo_otp: '',
  documento: '',
  celular_contato: '',
})

const cargosDisponiveis = [
  { label: 'Sou Aluno', value: 'aluno' },
  { label: 'Sou Professor', value: 'professor' },
  { label: 'Sou Diretor', value: 'diretoria' },
  { label: 'Sou Parceiro', value: 'parceiro' }
]

const maskCelular = '(##) #####-####'
const maskDocumento = computed(() => {
  return getCpfCnpjMask(formData.value.documento)
})

const ruleOTPCargo = computed(() => {
  if (formData.value.cargo === 'diretoria') return [rules.required()]
  return []
})

function getCpfCnpjMask(value: string) {
  if (!value) return '###.###.###-##'

  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return '###.###.###-##'
  }

  return '##.###.###/####-##'
}

async function handleSubmit(event: any) {
  const { valid } = await event;
  if (valid) emit('submit', { ...formData.value });
}

</script>
