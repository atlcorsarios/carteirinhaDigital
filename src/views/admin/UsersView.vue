<template>
  <GenericView
    :headers="ClassUsuarios.headers"
    id-field="id"
    :context-id="String(route.name)"
    :title="t('dataTable.users.title')"
    :hasActions="true"
    :text-create="t('messages.forms.formUsers.createUser')"
    :text-edit="t('messages.forms.formUsers.editingUser')"
    :icon-create="'mdi-account-plus'"
    :icon-edit="'mdi-account-edit'"
    :icon-save="'mdi-account-check'"
    :dialog-model-manager="dialogUser"
    :class-model-manager="userModelManager"
    :service-fetch="(payload) => UsersService.paginationsUsers(payload, ClassUsuarios.filters)"
    :service-save="UsersService.saveUser"
    :service-delete="UsersService.inactivateUser"
  >
    <template #form="{ updateValid, refForm, submitForm }">
      <ProfileForm
        :ref="refForm"
        v-model:profile="userModelManager.model"
        v-model:otp="dummyOtp"
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
import { UsersService } from '@/services/resources/usuariosService'

// Vue
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const { t } = useI18n();
const route = useRoute();

const loading = ref(false);
const dummyOtp = ref('');

const classUser = new ClassUsuarios();
const dialogUser = new ClassBaseDialog<IUser>({
  persistent: true,
  maxWidth: 800,
});

const userModelManager = {
  model: classUser.model,
  reset: () => classUser.reset(),
  updateModel: (item: IUser) => {
    classUser.updateModel(item)
  },
}
</script>
