import type { IHeaderPaginatorModel } from "@/classes/models/ModelHeaderPaginator";
import type { INotification } from "@/classes/models/ModelNotifications";

export const notificationsServices = {
  async getAllNotifications(offset: number, limit: number): Promise<IHeaderPaginatorModel<INotification>> {
    try {
      const mockData: IHeaderPaginatorModel<INotification> = {
        limit: limit,
        offset: offset,
        total: 100,
        items: [
          {
            idNotification: 1,
            title: '',
            description: '',
            message: '',
            date: new Date(),
            seen: false,
            sender: '',
            recipients: [''],
            origin: ''
          },

        ]
      };

      await new Promise(resolve => setTimeout(resolve, 2500));

      return mockData;
    } catch (error) {
      throw error
    }
  },
}
