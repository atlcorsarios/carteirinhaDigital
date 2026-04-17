<template>
  <v-row dense>
    <v-col
      cols="4"
      class="text-start"
    >
      <v-badge
        dot
        floating
        location="top right"
        :color="produto.ativo ? 'success' : 'grey-darken-1'"
        v-tooltip="t('forms.formProduct.ativo.label')"
      />
      <v-img
        :src="imageUrl || 'https://placehold.co/300x200/cccccc/666666?text=Sem+imagem'"
        :alt="produto.nome"
        rounded="lg"
        width="300"
        max-height="200"
      />
    </v-col>
    <v-col
      cols="8"
      class="mt-5"
    >
      <p>ID: {{ produto.id }}</p>
      <p>{{ produto.descricao_produto }}</p>
      <p>{{ formatPrice }}</p>

      <p>
        {{ t('forms.formProduct.ativo.label') }}

        <v-chip :color="produto.ativo ? 'success' : 'error'">
          {{ ClassFormatters.formatBoolean(produto.ativo || false) }}
        </v-chip>
      </p>

      <v-tabs
        v-model="tab"
        grow
        color="primary"
        slider-color="indigo-lighten-4"
        class="mt-5"
      >
        <v-tab
          v-if="produto.especificacoes_produto"
          value="especificacoes"
        >
          {{ t('forms.formProduct.especificacoes_produto.label') }}
        </v-tab>
        <v-tab
          v-if="produto.parceiro"
          value="parceiro"
        >
          {{ t('forms.formProduct.parceiro.label') }}
        </v-tab>
        <v-tab
          v-if="produto.promocao && produto.promocao.length > 0"
          value="promocao"
        >
          {{ t('forms.formProduct.promocao.label') }}
        </v-tab>
      </v-tabs>
    </v-col>
  </v-row>
  <v-row dense>
    <v-col cols="12">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="especificacoes">
          <v-sheet class="pa-5 texto-preparo text-body-1">
            {{ produto.especificacoes_produto }}
          </v-sheet>
        </v-tabs-window-item>

        <v-tabs-window-item value="parceiro">
          <CardUsuario :usuario="produto.parceiro" />
        </v-tabs-window-item>

        <v-tabs-window-item value="promocao">
          <v-sheet class="text-h6 w-100 mt-5 pa-5">
            <v-chip v-for="(promoItem, index) in produto.promocao" :key="index">
              {{ promoItem.promocoes.descricao_promocao }}
            </v-chip>
          </v-sheet>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import CardUsuario from './CardUsuario.vue';
import type { IProdutosDetalhados } from '@/classes/models/resources/ModelIProdutos';
import { ClassFormatters } from '@/classes/ClassFormatters';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const tab = ref('');

const props = defineProps<{
  produto: Partial<IProdutosDetalhados>
}>();

const imageUrl = computed(() => {
  return props.produto.avatar_url_produto || undefined
});

const formatPrice = computed(() => {
  return ClassFormatters.formatPriceDynamic(props.produto.valor_produto ?? 0)
});

</script>

<style scoped>
.texto-preparo {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
