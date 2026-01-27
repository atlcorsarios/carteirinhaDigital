<template>
  <v-col cols="12" md="6">
    <v-number-input
      v-model="category.idCategory"
      :label="label"
      :hint="hint"
      controlVariant="stacked"
      density="compact"
      variant="outlined"
      clearable
      inset
    >
      <template #prepend-inner>
        <v-icon-btn
          icon="mdi-tag-search"
          icon-color="info"
          variant="plain"
          @click="handleSearchCategories"
        />
      </template>

      <template v-if="loading" #append-inner>
        <v-progress-circular
          color="primary"
          indeterminate
        />
      </template>
    </v-number-input>
  </v-col>

  <v-col cols="12" md="6">
    <v-text-field
      :model-value="category.description"
      disabled
      density="compact"
      variant="outlined"
    />
  </v-col>

  <DialogSearchCategories
    v-model:dialog-search-category="dialogSearchCategories"
    @select-item="onCategorySelected"
  />
</template>

<script setup lang="ts">
import DialogSearchCategories from '@/components/dialog/searchs/categories/DialogSearchCategories.vue';
import { type ICategory } from '@/classes/models/ModelIProduct';
import { ClassBaseDialog } from '@/classes/ClassBaseDialog';
import { ref, watch } from 'vue';
import { ClassCategories } from '@/classes/products/ClassCategories';

const loading = ref<boolean>(false)

const props = defineProps<{
  label?: string,
  hint?: string
}>()

const category = defineModel<ICategory>('category', { required: true })
const dialogSearchCategories = new ClassBaseDialog({
  maxWidth: 600
})

function handleSearchCategories() {
  dialogSearchCategories.toggleDialog()
}

function onCategorySelected(selectedItem: ICategory) {
  category.value = selectedItem
}

function clearCategory() {
  category.value = {
    ...ClassCategories.defaultCategory()
  }
}

watch(() => category.value.idCategory, (newIdCategory) => {
  if (!newIdCategory) {
    clearCategory()
  }
})
</script>
