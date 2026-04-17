<template>
  <GenericView
    :headers="ClassNotifications.headers"
    id-field="idNotification"
    cursor-key="created_at"
    context-id="notificacoes"
    :title="'dataTable.notifications'"
    :has-actions="false"
    :dialog-model-manager="dialogNotifications"
    :class-model-manager="notificationsModelManager"
    :service-fetch="NotificationsServices.paginationsNotificacoes"
  />
</template>

<script setup lang="ts">
// Componentes
import GenericView from '@/components/layouts/generics/GenericView.vue'

// Models
import type { INotification } from '@/classes/models/resources/ModelNotifications'

// Classes
import { ClassNotifications } from '@/classes/resources/ClassNotificacoes'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { NotificationsServices } from '@/services/resources/notificacoesService'

const classNotifications = new ClassNotifications()
const dialogNotifications = new ClassBaseDialog<INotification>({
  persistent: true,
  maxWidth: 800,
})

const notificationsModelManager = {
  model: classNotifications.model,
  reset: () => classNotifications.reset(),
  updateModel: (item: any) => {
    classNotifications.updateModel(item)
  },
}

</script>
