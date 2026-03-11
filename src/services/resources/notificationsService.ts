import type { IHeaderPaginatorModel } from '@/classes/models/ModelHeaderPaginator'
import type { INotification } from '@/classes/models/resources/ModelNotifications'

export const notificationsServices = {
  async getAllNotifications(
    offset: number,
    limit: number,
  ): Promise<IHeaderPaginatorModel<INotification>> {
    try {
      const mockData: IHeaderPaginatorModel<INotification> = {
        limit: limit,
        offset: offset,
        total: 100,
        items: [
          {
            idNotification: 1,
            title: 'First notification',
            description: 'Test',
            message: '',
            date: new Date(),
            seen: false,
            sender: '',
            recipients: [''],
            origin: '',
          },
          {
            idNotification: 2,
            title: 'Notification n° 2',
            description: 'Test 2',
            message: '',
            date: new Date(),
            seen: true,
            sender: 'AVELITO',
            recipients: [''],
            origin: 'Ecommerce',
          },
        ],
      }

      await new Promise((resolve) => setTimeout(resolve, 2500))

      return mockData
    } catch (error) {
      throw error
    }
  },
}
