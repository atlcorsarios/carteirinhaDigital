<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="600" elevation="8" rounded="lg" class="pa-6 text-center">
      <v-card-title class="text-h4 text-primary font-weight-bold mb-4">
        Quase lá!
      </v-card-title>
      <v-card-text>
        <p class="mb-6 text-body-1">
          Precisamos de mais alguns dados para finalizar o seu cadastro e preparar o seu ambiente.
        </p>

        <v-form ref="formRef" v-model="isValid" @submit.prevent="saveProfile">
          <v-select
            v-model="formData.cargo"
            :items="cargosDisponiveis"
            item-title="label"
            item-value="value"
            label="Como você vai usar o sistema?"
            variant="outlined"
            density="comfortable"
            :rules="[(v: any) => !!v || 'Campo obrigatório']"
          />

          <v-text-field
            v-model="formData.documento"
            label="CPF / CNPJ"
            variant="outlined"
            density="comfortable"
            :rules="[(v: any) => !!v || 'Campo obrigatório']"
          />

          <v-text-field
            v-model="formData.celular_contato"
            label="Celular (WhatsApp)"
            variant="outlined"
            density="comfortable"
            :rules="[(v: any) => !!v || 'Campo obrigatório']"
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
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'

const authStore = useAuthStore()
const router = useRouter()
const { notify } = useSnackbar()

const formRef = ref()
const isValid = ref(false)
const loading = ref(false)

const formData = ref({
  cargo: 'aluno',
  documento: '',
  celular_contato: ''
})

const cargosDisponiveis = [
  { label: 'Sou Aluno', value: 'aluno' },
  { label: 'Sou Professor', value: 'professor' },
  { label: 'Quero ser Parceiro (Oferecer descontos)', value: 'parceiro' }
]

async function saveProfile() {
  await formRef.value?.validate()
  if (!isValid.value || !authStore.user) return

  try {
    loading.value = true

    // Atualiza o perfil na tabela usuarios
    const { error } = await supabase
      .from('usuarios')
      .update({
        cargo: formData.value.cargo,
        documento: formData.value.documento,
        celular_contato: formData.value.celular_contato
      })
      .eq('id', authStore.user.id)

    if (error) throw error

    // Recarrega o perfil atualizado na Store
    await authStore.fetchUser(authStore.user.id)

    notify('Perfil atualizado com sucesso!', 'success')
    router.push({ name: 'Home' })

  } catch (error) {
    console.error(error)
    notify('Erro ao salvar o perfil.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
