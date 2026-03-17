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
          <InputUploadImage
            class="mb-5"
            v-model:url="formData.avatar_url"
            :bucket="'avatars'"
            :owner="ownerBucket"
          />

          <v-select
            v-model="formData.cargo"
            :items="cargosDisponiveis"
            item-title="label"
            item-value="value"
            label="Como você vai usar o sistema?"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required()]"
          />

          <v-mask-input
            v-if="formData.cargo === 'diretoria'"
            v-model="formData.codigo_otp"
            :mask="'######'"
            label="Código de verificação do cargo"
            variant="outlined"
            density="comfortable"
            :rules="ruleOTPCargo"
          />

          <v-mask-input
            v-model="formData.documento"
            :mask="maskDocumento"
            label="CPF / CNPJ"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required()]"
          />

          <v-mask-input
            v-model="formData.celular_contato"
            :mask="maskCelular"
            label="Celular (WhatsApp)"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required()]"
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
import InputUploadImage from '@/components/forms/fixtures/InputUploadImage.vue'
import { OnboardingService } from '@/services/onboardingService'
import { sanitizeName } from '@/utils/sanitizeForBucket'
import { useSnackbar } from '@/composables/useSnackbar'
import { useAuthStore } from '@/stores/authStore'
import { useRules } from 'vuetify/labs/rules'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const { notify } = useSnackbar()
const rules = useRules()
const authStore = useAuthStore()
const router = useRouter()

const formRef = ref()
const isValid = ref(false)
const loading = ref(false)

const maskDocumento = '###.###.###-##';
const maskCelular = '(##) #####-####';

const formData = ref({
  avatar_url: '',
  cargo: 'aluno',
  codigo_otp: '',
  documento: '',
  celular_contato: '',
})

const ownerBucket = computed(() => {
  const idUser = authStore.user?.id
  if (idUser == undefined) throw new Error('id undefined')
  return sanitizeName(idUser);
})

const ruleOTPCargo = computed(() => {
  if (formData.value.cargo === 'diretoria') return [rules.required()]
  else return []
})

const cargosDisponiveis = [
  { label: 'Sou Aluno', value: 'aluno' },
  { label: 'Sou Professor', value: 'professor' },
  { label: 'Sou Diretor', value: 'diretoria' },
  { label: 'Sou Parceiro', value: 'parceiro' }
]

async function saveProfile(event: any) {
  const { valid } = await event;
  if (!valid || !authStore.user) return;

  try {
    loading.value = true;
    
    await OnboardingService.finalizarCadastro(authStore.user.id, formData.value);
    await authStore.fetchUser(authStore.user.id);

    notify('Perfil atualizado com sucesso!', 'success');
    router.push({ name: 'Home' });

  } catch (error) {
    notify(error, 'error');
  } finally {
    loading.value = false;
  }
}

</script>
