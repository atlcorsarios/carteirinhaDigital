<template>
  <v-form ref="formRef" v-model="formIsValid" @submit.prevent="handleSubmit">
    <v-text-field
      v-model="produto.id"
      disabled
      class="d-none"
    />

    <v-row dense>
      <v-col
        cols="4"
        class="d-flex flex-column pe-5"
      >
        <InputUploadImage
          v-model="produto.avatar_url_produto"
          :label="'forms.formProduct.avatar_url_produto.label'"
          :size="100"
          :bucket="'produtos'"
          :owner="ownerBucket"
        />
      </v-col>

      <v-col
        cols="8"
        class="d-flex flex-column"
      >
        <v-row
          dense
          align="center"
        >
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="produto.nome"
              :rules="[rules.required(), rules.maxLength(100)]"
              :label="t('forms.formProduct.nome.label')"
              density="compact"
              variant="outlined"
              counter
              clearable
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <InputPrice
              v-model="produto.valor_produto"
              :rules="[rules.required()]"
            />
          </v-col>

          <v-col
            cols="12"
            class="d-flex justify-center"
          >
            <v-switch
              v-model="produto.ativo"
              :label="produto.ativo ? t('forms.campoAtivo.true') : t('forms.campoAtivo.false')"
              :indeterminate="produto.ativo === null || produto.ativo === undefined"
              inset
              hide-details
              color="success"
              density="compact"
              class="d-flex justify-center"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row
      dense
      align="center"
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-textarea
          v-model="produto.descricao_produto"
          :rules="[rules.required(), rules.minLength(30)]"
          :label="t('forms.formProduct.descricao_produto.label')"
          density="compact"
          variant="outlined"
          counter
          clearable
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-textarea
          v-model="produto.especificacoes_produto"
          :rules="[rules.required(), rules.minLength(50)]"
          :label="t('forms.formProduct.especificacoes_produto.label')"
          density="compact"
          variant="outlined"
          counter
          clearable
        />
      </v-col>
    </v-row>

    <v-row
      v-if="!isParceiro"
      dense
      align="center"
    >
      <v-col cols="12">
        <InputParceiro
          v-model:parceiro="produto.parceiro"
          v-model:idParceiro="produto.id_parceiro"
        />
      </v-col>
    </v-row>

    <button
      type="submit"
      class="d-none"
    />
  </v-form>
</template>

<script setup lang="ts">
// Componentes
import InputUploadImage from '../fixtures/InputUploadImage.vue'
import InputPrice from '../fixtures/InputPrice.vue'
import InputParceiro from '../fixtures/InputParceiro.vue'

// Models
import { type IProdutosDetalhados } from '@/classes/models/resources/ModelIProdutos'

// Utils
import { sanitizeName } from '@/utils/sanitizeForBucket'

// Stores
import { useAuthStore } from '@/stores/authStore'

// Vue
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

const { t } = useI18n();
const rules = useRules();
const authStore = useAuthStore();

const formRef = ref<any>(null);
const produto = defineModel<Partial<IProdutosDetalhados>>('produto', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });
const emit = defineEmits(['submit']);

const ownerBucket = computed(() => {
  const idUser = authStore.user?.id
  if (idUser == undefined) throw new Error('id undefined')
  return sanitizeName(idUser);
});

const isParceiro = computed(() => authStore.userProfile?.cargo === 'parceiro');

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  if (valid) {
    if (isParceiro.value) {
      produto.value.id_parceiro = String(authStore.userProfile?.id);
    }
    emit('submit')
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
