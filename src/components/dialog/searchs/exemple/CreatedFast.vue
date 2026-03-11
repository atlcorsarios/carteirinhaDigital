<!-- <template>
  <GenericCreateQuickly
    :title="t('messages.forms.formResource.create')"
    :icon="'mdi-plus'"
    :save-icon="'mdi-check'"
    :dialog-model="dialogModel"
    :class-manager="Manager"
    :service-save="Services.save"
    @created-fast-item="(item) => $emit('created-fast-item', item)"
  >
    <template #form="{ model, updateValid, refForm, submitForm }">
      <Form
        :ref="refForm"
        :model="model"
        @update:model="(val) => Object.assign(model, val)"
        @update:valid="updateValid"
        @submit="submitForm"
        :create-fast="true"
      />
    </template>
  </GenericCreateQuickly>
</template>

<script setup lang="ts">
// Componentes
import GenericCreateQuickly from '../GenericCreateQuickly.vue'
import Form from '@/components/forms/resources/Form.vue'

// Classes
import { Class } from '@/classes/resources/Class'

// Services
import { Services } from '@/services/resources/Service'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialogModel = defineModel<any>('dialog-create-quickly', { required: true })
defineEmits(['created-fast-item'])

const class = new Class()
const Manager = {
  model: class.model,
  reset: () => class.reset(),
}

</script> -->
