import { ClassNotifications } from "@/classes/ClassNotifications";
import type { INotifications } from "@/classes/models/ModelNotifications";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationsStore = defineStore('notifications', () => {
  const defaultNotificationsTest = ref<Partial<INotifications>[]>([
    {
      id: 1,
      title: 'Teste notificação',
      description: 'Tem nem i18n ainda',
      message: 'Era pra fazer a tela de cadastro de produto, seu animal kkkkk',
    },
  ]);

  const classNotifications = new ClassNotifications(defaultNotificationsTest.value);
  const notifications = ref<INotifications[] | undefined>(classNotifications.model);

  async function fetchNotifications() {

  }

  return {
    notifications,
    fetchNotifications
  }
})
