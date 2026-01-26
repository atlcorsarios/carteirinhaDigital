import type { IHeadersDataTable, TEntityConfig } from './models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from './models/ModelFilterColumns'
import type { INotification } from './models/ModelNotifications'
import type { IQueryFilter } from './models/modelComponents/ModelQueryFilter'
import { formattedDate } from '@/utils/formattedDate'
import { FALLBACK_LOCALE } from '@/locales/definitionsLocales'
import { BaseClass } from './subscriptions/BaseClass'
import { ClassFormatters } from './ClassFormatters'

export class ClassNotifications extends BaseClass<INotification> {
  constructor(data?: Partial<INotification>) {
    super(data)
  }

  static defaultNotification(): INotification {
    const today = new Date()
    const locale = typeof navigator !== 'undefined' ? navigator.language : FALLBACK_LOCALE
    const dateStr = formattedDate(today, locale)

    return {
      seen: false,
      idNotification: 0,
      title: '',
      description: '',
      message: '',
      date: dateStr,
      sender: '',
      recipients: [],
      origin: '',
    }
  }

  protected getDefault(data: unknown = {}): INotification {
    const item = data as Partial<INotification>
    return this.createWithDefaults(item, ClassNotifications.defaultNotification())
  }

  static get fieldConfig(): TEntityConfig<INotification> {
    return {
      seen: {
        align: 'center',
        chartFormatter: ClassFormatters.formatBoolean,
        value: (item) => ClassFormatters.formatBoolean(item.seen),
        excludeFromFilter: true,
        width: 50,
        cellClass: (value: boolean) => {
          if (value === true) return 'text-success font-weight-bold'
          else return 'text-error font-weight-bold'
        }
      },
      idNotification: {
        width: 50,
        excludeFromFilter: true,
      },
      title: {
        maxWidth: 250,
      },
      description: {
        hidden: true
      },
      message: {
        hidden: true
      },
      date: {
        maxWidth: 100
      },
      sender: {
        maxWidth: 100,
      },
      recipients: {
        hidden: true
      },
      origin: {
        maxWidth: 100
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassNotifications().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formNotifications',
      ClassNotifications.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassNotifications().getDefault()
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formNotifications',
      ClassNotifications.fieldConfig,
    )
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'title',
      condition: 'contains',
    }
  }
}
