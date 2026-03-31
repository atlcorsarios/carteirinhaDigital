<template>
  <GenericView :headers="ClassNotifications.headers" :id-field="'idNotification'"
    :title="t('dataTable.notifications.title')" :has-actions="false" :dialog-model-manager="dialogNotifications"
    :class-model-manager="notificationsModelManager" :service-fetch="notificationsServices.getAllNotifications" />
</template>

<script setup lang="ts">
// Componentes
import GenericView from '@/components/layouts/generics/GenericView.vue'

// Models
import type { INotification } from '@/classes/models/resources/ModelNotifications'

// Classes
import { ClassNotifications } from '@/classes/resources/ClassNotifications'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'

// Services
import { notificationsServices } from '@/services/resources/notificacoesService'

// Vue
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
