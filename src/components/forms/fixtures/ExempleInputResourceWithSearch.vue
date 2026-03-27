<!-- <template>
  <v-col cols="12" md="6">
    <v-number-input
      v-model="resource.id"
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
          icon="mdi-silverware-variant"
          icon-color="info"
          variant="plain"
          @click="handleSearchResources"
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

  <v-col
    cols="12"
    md="6"
  >
    <v-text-field
      :model-value="resource.description"
      disabled
      density="compact"
      variant="outlined"
    />
  </v-col>

  <DialogSearch
    v-model:dialog-search-recipe="dialogSearchResource"
    @select-item="onResourceSelected"
  />
</template>

<script setup lang="ts">
// Componentes
import DialogSearch from '@/components/dialog/searchs/exemple/DialogSearch.vue'

// Models
import { type Interface } from '@/classes/models/resources/Interface'

// Classes
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { Class } from '@/classes/resources/Class'

// Vue
import { ref, watch } from 'vue'

const loading = ref<boolean>(false)

const props = defineProps<{
  label?: string
  hint?: string
}>()

const resource = defineModel<Interface>('resource', { required: true })
const dialogSearchResource = new ClassBaseDialog({
  maxWidth: 600,
})

function handleSearchResources() {
  dialogSearchResource.toggleDialog()
}

function onResourceSelected(selectedItem: Interface) {
  resource.value = selectedItem
}

function clearResource() {
  resource.value = {
    ...Class.defaultResource(),
  }
}

watch(() => resource.value.id, (newId) => {
  if (!newId) {
    clearResource()
  }
});

</script> -->
