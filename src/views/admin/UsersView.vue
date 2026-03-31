<template>
  <GenericView
    :headers="ClassUsuarios.headers"
    :id-field="'idUser'"
    :title="t('dataTable.users.title')"
    :hasActions="true"
    :text-create="t('messages.forms.formUsers.createUser')"
    :text-edit="t('messages.forms.formUsers.editingUser')"
    :icon-create="'mdi-account-plus'"
    :icon-edit="'mdi-account-edit'"
    :icon-save="'mdi-account-check'"
    :dialog-model-manager="dialogUser"
    :class-model-manager="userModelManager"
    :service-fetch="profileServices.getAllUsers"
    :service-save="profileServices.saveUser"
  >
    <template #form="{ model, updateValid, refForm, submitForm }">
      <ProfileForm
        :ref="refForm"
        v-model:profile="model"
        :loading="loading"
        @update:valid="updateValid"
        @submit="submitForm"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
// Componentes
import GenericView from '@/components/layouts/generics/GenericView.vue'
import ProfileForm from '@/components/forms/resources/ProfileForm.vue'

// Models
import type { IUser } from '@/classes/models/resources/ModelUsuarios'

// Classes
import { ClassUsuarios } from '@/classes/resources/ClassUsuarios'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { profileServices } from '@/services/resources/perfilService'

// Vue
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const loading = ref(false)

const classUser = new ClassUsuarios()
const dialogUser = new ClassBaseDialog<IUser>({
  persistent: true,
  maxWidth: 800,
})

const userModelManager = {
  model: classUser.model,
  reset: () => classUser.reset(),
  updateModel: (item: any) => {
    classUser.updateModel(item)
  },
}

</script>
