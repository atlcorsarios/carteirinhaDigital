<template>
  <v-col cols="12" md="6">
    <v-number-input
      v-model="ingredient.idIngredient"
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
          icon="mdi-shaker"
          icon-color="info"
          variant="plain"
          @click="handleSearchIngredients"
        />
      </template>

      <template v-if="loading" #append-inner>
        <v-progress-circular color="primary" indeterminate />
      </template>
    </v-number-input>
  </v-col>

  <v-col cols="12" md="6">
    <v-text-field
      :model-value="ingredient.description"
      disabled
      density="compact"
      variant="outlined"
    />
  </v-col>

  <DialogSearchIngredients
    v-model:dialog-search-ingredient="dialogSearchIngredients"
    v-model:selectedItens="tempArray"
    :is-multiple="false"
  />
</template>

<script setup lang="ts">
import DialogSearchIngredients from '@/components/dialog/searchs/ingredients/DialogSearchIngredients.vue'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassIngredients } from '@/classes/products/ClassIngredients'
import { nextTick, ref, watch } from 'vue'

const loading = ref<boolean>(false)

const ingredient = defineModel<any>('ingredient', { required: true })
const emit = defineEmits(['update:ingredient'])
const props = defineProps<{
  label?: string
  hint?: string
}>()

const tempArray = ref<any[]>([])
const dialogSearchIngredients = new ClassBaseDialog({
  maxWidth: 600,
})

function handleSearchIngredients() {
  dialogSearchIngredients.toggleDialog()
}

function clearIngredient() {
  ingredient.value = {
    ...ClassIngredients.defaultIngredient(),
  }
}

watch(tempArray, async (newVal) => {
  if (newVal && newVal.length > 0) {
    if (!ingredient.value) {
      ingredient.value = {}
    }

    Object.assign(ingredient.value, newVal[0])
    emit('update:ingredient', ingredient.value)
    await nextTick()
    tempArray.value = []
  }
}, { deep: true })

watch(() => ingredient.value?.idIngredient, (newIdIngredient) => {
    if (!newIdIngredient) {
      clearIngredient()
    }
  },
)
</script>
