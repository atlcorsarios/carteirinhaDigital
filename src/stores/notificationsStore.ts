import { ClassNotifications } from "@/classes/ClassNotifications";
import type { INotifications } from "@/classes/models/ModelNotifications";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore";

export const useNotificationsStore = defineStore('notifications', () => {
  const authStore = useAuthStore();

  const defaultNotificationsTest = ref<Partial<INotifications>[]>([
    {
      id: 1,
      title: 'Teste notificação',
      description: 'Tem nem i18n ainda',
      message: 'Era pra fazer a tela de cadastro de produto, seu animal kkkkk',
      sender: 'Usuário.ficticio@gmail.com',
      recipients: ['avelito@gmail.com']
    },
    {
      id: 2,
      title: 'Teste notificação visualizada',
      description: 'Precisa de lógica para marcar as mensagens como visualizada',
      message: 'Separação entre as mensagens visualizadas e não visualizadas, isso é por usuário então deve ter um controle (deixar para quando tiver o banco, será mais fácil)',
      seen: true,
      sender: 'Usuário.ficticio@gmail.com',
      recipients: ['avelito@gmail.com']
    },
    {
      id: 3,
      title: 'Teste notificação visualizada',
      description: 'Precisa de lógica para marcar as mensagens como visualizada',
      message: 'Separação entre as mensagens visualizadas e não visualizadas, isso é por usuário então deve ter um controle (deixar para quando tiver o banco, será mais fácil)',
      date: new Date(2026, 0, 10, 10, 30, 0),
      sender: 'Usuário.ficticio2@gmail.com',
      recipients: ['funcionarioAvelito@gmail.com']
    },
  ]);

  const classNotifications = new ClassNotifications(defaultNotificationsTest.value);
  const notifications = ref<INotifications[]>(classNotifications.model);

  async function fetchNotifications(): Promise<INotifications[]> {
    return notifications.value;
  }

  async function notificationsToUser(): Promise<INotifications[]> {
    if (!authStore.user) {
      await authStore.fetchUser()
    }

    const userEmail = authStore.user?.email;
    
    if (!userEmail) {
      return [];
    }

    return notifications.value.filter((notification) => {
      const recipients = notification.recipients as string[];
      return recipients.includes(userEmail);
    });
  }

  async function hasUnread(): Promise<boolean> {
    const userNotifications = await notificationsToUser();
    return userNotifications.some(n => !n.seen);
  }

  return {
    fetchNotifications,
    notificationsToUser,
    hasUnread
  }
});
