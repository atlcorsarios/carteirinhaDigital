<template>
  <GenericView
    :headers="ClassUsers.headers"
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
    :service-fetch="usersServices.getAllUsers"
    :service-save="usersServices.saveUser"
  >
    <template #form="{ model, updateValid, refForm, submitForm }">
      <UserForm
        :ref="refForm"
        :user="model"
        @update:valid="updateValid"
        @submit="submitForm"
      />
    </template>
  </GenericView>
</template>

<script setup lang="ts">
// Componentes
import GenericView from '@/views/view/GenericView.vue'
import UserForm from '@/components/forms/UserForm.vue'

// Models
import type { IUser } from '@/classes/models/ModelUser'

// Classes
import { ClassUsers } from '@/classes/ClassUsers'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { usersServices } from '@/services/resources/usersService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const classUser = new ClassUsers()
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
