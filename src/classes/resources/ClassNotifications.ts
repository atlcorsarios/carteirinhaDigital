import { ClassFormatters } from '../ClassFormatters'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { INotification } from '../models/resources/ModelNotifications'
import { BaseClass } from '../subscriptions/BaseClass'

export class ClassNotifications extends BaseClass<INotification> {
  constructor(data?: Partial<INotification>) {
    super(data)
  }

  static defaultNotification(): INotification {
    return {
      idNotification: 0,
      title: '',
      description: '',
      message: '',
      sender: '',
      recipients: [],
      seen: false,
      date: new Date(),
    }
  }

  protected getDefault(data: unknown = {}): INotification {
    const item = data as Partial<INotification>
    return this.createWithDefaults(item, ClassNotifications.defaultNotification())
  }

  static get fieldConfig(): TEntityConfig<INotification> {
    return {
      idNotification: {
        width: 50,
        excludeFromFilter: true,
        excludeFromChart: true,
      },
      title: {
        width: 200,
        maxWidth: 300,
        minWidth: 100,
        excludeFromChart: true
      },
      description: {
        width: 200,
        maxWidth: 300,
        minWidth: 100,
        excludeFromChart: true
      },
      message: {
        width: 200,
        maxWidth: 300,
        minWidth: 100,
        excludeFromChart: true
      },
      sender: {
        width: 200,
        maxWidth: 300,
        minWidth: 100,
        excludeFromChart: true
      },
      recipients: {
        width: 200,
        maxWidth: 300,
        minWidth: 100,
        excludeFromChart: true
      },
      seen: {
        align: 'center',
        width: 50,
        excludeFromFilter: true,
        chartFormatter: ClassFormatters.formatBoolean,
        value: (notification: INotification) => ClassFormatters.formatBoolean(notification.seen),
        cellClass: (value: boolean) => {
          if (value === true) return 'text-success font-weight-bold'
          else return 'text-error font-weight-bold'
        },
      },
      date: {
        align: 'end',
        width: 200,
        maxWidth: 300,
        minWidth: 100,
        excludeFromChart: true,
        chartFormatter: ClassFormatters.formatDate,
        value: (notification: INotification) => ClassFormatters.formatDate(notification.date)
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
