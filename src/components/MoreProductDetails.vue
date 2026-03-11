<template>
  <v-card>
    <v-card-title class="d-flex sticky-title bg-surface">
      <div class="text-h6 w-100 me-auto">
        {{ product.idProduct }} -
        {{ product.description }}
      </div>

      <v-icon-btn
        icon="mdi-close"
        v-tooltip="t('tooltips.forms.close')"
        variant="text"
        color="info"
        @click="$emit('close')"
      />
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="4" class="text-start">
          <v-badge
            location="top right"
            dot
            floating
            :color="product.active ? 'success' : 'grey-darken-1'"
            v-tooltip="t('forms.formProduct.active.label')"
          />
          <v-img
            :src="imageUrl"
            :alt="product.description"
            rounded="lg"
            width="350"
            max-height="350"
          />
        </v-col>
        <v-col cols="8">
          <p>{{ formatPrice }}</p>
          <p>{{ categoryProduct }}</p>
          <v-tabs v-model="tab" color="primary" slider-color="indigo-lighten-4" grow class="mt-5">
            <v-tab value="ingredients">{{ t('forms.formRecipe.ingredients.headerTable') }}</v-tab>
            <v-tab value="preparation">{{ t('forms.formRecipe.preparation.label') }}</v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <div class="text-h6 w-100 mt-5">{{ product.recipe.description }}</div>
          <v-divider />

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="ingredients">
              <v-sheet class="pa-5">
                <v-list-item v-for="(ingredient, index) in ingredients" :key="index">
                  <v-list-item-title>{{ ingredient.ingredient.description }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ ingredient.amount }} -
                    {{ ingredient.ingredient.measurement }}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle
                    >{{ ingredient.ingredient.category.group }} -
                    {{ ingredient.ingredient.category.description }}</v-list-item-subtitle
                  >
                  <v-divider class="mt-2" :thickness="3" />
                </v-list-item>
              </v-sheet>
            </v-tabs-window-item>
            <v-tabs-window-item value="preparation">
              <v-sheet class="pa-5 texto-preparo text-body-1">{{ preparation }}</v-sheet>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Models
import type { IProduct } from '@/classes/models/resources/ModelIProduct'

// Classes
import { ClassFormatters } from '@/classes/ClassFormatters'

// Vue
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

const { t } = useI18n()

const props = defineProps<{
  product: IProduct
}>()

defineEmits(['close'])

const imageUrl = computed(() => {
  return props.product.image || undefined
})

const formatPrice = computed(() => {
  return ClassFormatters.formatPriceDynamic(props.product.price ?? 0)
})

const categoryProduct = computed(() => {
  return props.product.category
    ? `${props.product.category.group} - ${props.product.category.description}`
    : ''
})

const ingredients = computed(() => {
  return props.product.recipe.ingredients || []
})

const preparation = computed(() => {
  return props.product.recipe.preparation || ''
})

const tab = ref('ingredients')
</script>

<style scoped>
.texto-preparo {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
