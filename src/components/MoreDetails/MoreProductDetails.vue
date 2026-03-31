<template>
  <v-card>
    <v-card-title class="d-flex sticky-title bg-surface">
      <div class="text-h6 w-100 me-auto">
        {{ produto.nome }}
      </div>

      <v-icon-btn
        icon="mdi-close"
        variant="text"
        color="info"
        v-tooltip="t('tooltips.forms.close')"
        @click="$emit('close')"
      />
    </v-card-title>

    <v-card-text>
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
          <v-tabs
            v-model="tab"
            grow
            color="primary"
            slider-color="indigo-lighten-4"
            class="mt-5"
          >
            <v-tab value="especificacoes">{{ t('forms.formProduct.especificacoes_produto.label') }}</v-tab>
            <v-tab value="parceiro">{{ t('forms.formProduct.parceiro.label') }}</v-tab>
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
              <v-sheet class="text-h6 w-100 mt-5 pa-5">
                {{ produto.parceiro }}
                <!-- <v-list-item v-for="(ingredient, index) in ingredients" :key="index">
                  <v-list-item-title>{{ ingredient.ingredient.description }}</v-list-item-title>
                  <v-list-item-subtitle>{{ ingredient.amount }} -
                    {{ ingredient.ingredient.measurement }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ ingredient.ingredient.category.group }} -
                    {{ ingredient.ingredient.category.description }}</v-list-item-subtitle>
                  <v-divider class="mt-2" :thickness="3" />
                </v-list-item> -->
              </v-sheet>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Models
import type { IProdutos } from '@/classes/models/resources/ModelIProdutos'

// Classes
import { ClassFormatters } from '@/classes/ClassFormatters'

// Vue
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

const { t } = useI18n();

const tab = ref('ingredients');

defineEmits(['close']);
const props = defineProps<{
  produto: IProdutos
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
