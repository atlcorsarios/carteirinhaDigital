import type { IHeadersDataTable, TEntityConfig } from './models/modelComponents/ModelHeaderTable'
import type { IUser } from '@/classes/models/ModelUser'
import type { IFilterColumn } from './models/ModelFilterColumns'
import { BaseClass } from './subscriptions/BaseClass'
import { i18n } from '@/plugins/i18n'

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

  static formatBoolean(value?: boolean): string {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return value ? t('messages.yes') : t('messages.no')
  }

  static get fieldConfig(): TEntityConfig<IUser> {
    return {
      idUser: {
        width: 50,
        excludeFromFilter: true,
      },
      username: {
        width: 250,
      },
      email: {
        width: 200,
      },
      role: {
        width: 100,
        filterType: 'select',
        selectOptions: [
          { title: 'Admin', value: 'ADMIN' },
          { title: 'User', value: 'USER' },
        ],
      },
      phoneNumber: {
        align: 'end',
        width: 200,
      },
      receiveNotifications: {
        align: 'center',
        chartFormatter: ClassUsers.formatBoolean,
        value: (item) => ClassUsers.formatBoolean(item.receiveNotifications),
        excludeFromFilter: true,
      },
      active: {
        align: 'center',
        chartFormatter: ClassUsers.formatBoolean,
        value: (item: IUser) => ClassUsers.formatBoolean(item.active),
      },
    }
  }

  static get getHeaders(): IHeadersDataTable[] {
    const defaultModel = new ClassUsers().getDefault()
    return BaseClass.generateHeadersFromModel(defaultModel, 'forms.formUser', ClassUsers.fieldConfig)
  }

  static get getFilterColumns(): IFilterColumn[] {
    const defaultModel = new ClassUsers().getDefault()
    return BaseClass.generateFiltersFromModel(defaultModel, 'forms.formUser', ClassUsers.fieldConfig)
  }
}
