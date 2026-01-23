import type { IHeadersDataTable, TEntityConfig } from './models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from './models/ModelFilterColumns'
import type { IUser } from '@/classes/models/ModelUser'
import type { IQueryFilter } from './models/modelComponents/ModelQueryFilter'
import { BaseClass } from './subscriptions/BaseClass'
import { ClassFormatters } from './ClassFormatters'

export class ClassUsers extends BaseClass<IUser> {
  constructor(data?: Partial<IUser>) {
    super(data)
  }

  static defaultUser(): IUser {
    return {
      idUser: 0,
      username: '',
      email: '@gmail.com',
      role: 'USER',
      phoneNumber: '',
      receiveNotifications: false,
      active: true,
    }
  }

  protected getDefault(data: Partial<IUser> = {}): IUser {
    return this.createWithDefaults(data, ClassUsers.defaultUser())
  }

  static get fieldConfig(): TEntityConfig<IUser> {
    return {
      idUser: {
        width: 50,
        excludeFromFilter: true,
      },
      username: {
        maxWidth: 250,
      },
      email: {
        maxWidth: 200,
      },
      role: {
        maxWidth: 100,
        filterType: 'select',
        selectOptions: [
          { title: 'Admin', value: 'ADMIN' },
          { title: 'User', value: 'USER' },
        ],
      },
      phoneNumber: {
        align: 'end',
        maxWidth: 200,
      },
      receiveNotifications: {
        align: 'center',
        chartFormatter: ClassFormatters.formatBoolean,
        value: (item) => ClassFormatters.formatBoolean(item.receiveNotifications),
        excludeFromFilter: true,
        width: 50,
        cellClass: (value: boolean) => {
          if (value === true) return 'text-success font-weight-bold'
          else return 'text-error font-weight-bold'
        }
      },
      active: {
        align: 'center',
        chartFormatter: ClassFormatters.formatBoolean,
        value: (item) => ClassFormatters.formatBoolean(item.active),
        width: 50,
      },
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassUsers().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formUser',
      ClassUsers.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassUsers().getDefault()
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formUser',
      ClassUsers.fieldConfig,
    )
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'username',
      condition: 'contains'
    }
  }
}
