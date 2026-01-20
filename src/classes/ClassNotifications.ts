import type { IHeadersDataTable } from './models/modelComponents/ModelHeaderTable'
import type { INotification } from './models/ModelNotifications'
import { formattedDate } from '@/utils/formattedDate'
import { BaseClass } from './subscriptions/BaseClass'
import { FALLBACK_LOCALE, i18n } from '@/plugins/i18n'

export class ClassNotifications extends BaseClass<INotification[]> {
  constructor(data?: Partial<INotification>[]) {
    super(data as any)
  }

  get notifications() {
    return this.model
  }

  private get defaultItem(): INotification {
    const today = new Date()
    const locale = typeof navigator !== 'undefined' ? navigator.language : FALLBACK_LOCALE
    const dateStr = formattedDate(today, locale);
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
    } as INotification
  }

  protected getDefault(data?: unknown): INotification[] {
    const items = (data as Partial<INotification>[]) || []
    if (items.length === 0) return []
    return items.map((item) => this.createWithDefaults(item, this.defaultItem))
  }

  static getHeaders(): IHeadersDataTable[] {
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
}
