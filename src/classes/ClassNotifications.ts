import type { FilterColumn } from './models/ModelFilterColumns'
import type { IHeadersDataTable } from './models/modelComponents/ModelHeaderTable'
import type { INotification } from './models/ModelNotifications'
import { formattedDate } from '@/utils/formattedDate'
import { BaseClass } from './subscriptions/BaseClass'
import { FALLBACK_LOCALE, i18n } from '@/plugins/i18n'

export class ClassNotifications extends BaseClass<INotification> {
  constructor(data?: Partial<INotification>) {
    super(data)
  }

  static defaultNotification(): INotification {
    const today = new Date()
    const locale = typeof navigator !== 'undefined' ? navigator.language : FALLBACK_LOCALE
    const dateStr = formattedDate(today, locale)

    return {
      id: 0,
      title: '',
      description: '',
      message: '',
      date: dateStr,
      seen: false,
      sender: '',
      recipients: [],
      origin: '',
    }
  }

  protected getDefault(data: unknown = {}): INotification {
    const item = data as Partial<INotification>
    return this.createWithDefaults(item, ClassNotifications.defaultNotification())
  }

  static getHeaders(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return [
      {
        title: t('dataTable.notifications.headers.id'),
        align: 'start',
        key: 'idNotification',
        width: 50,
      },
      {
        title: t('dataTable.notifications.headers.title'),
        align: 'start',
        key: 'title',
        width: 200,
      },
    ]
  }

  static getFilterColumn(): FilterColumn[] {
    return [
      {
        key: 'id',
        label: 'dataTable.notifications.headers.id',
        type: 'number',
      },
    ]
  }
}
