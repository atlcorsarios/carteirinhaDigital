import type { IHeadersDataTable } from './models/modelComponents/ModelHeaderTable'
import type { IUser } from '@/classes/models/ModelUser'
import { BaseClass } from './subscriptions/BaseClass'
import { i18n } from '@/plugins/i18n'

export class ClassUsers extends BaseClass<IUser> {
  constructor(data?: Partial<IUser>) {
    super(data as any)
  }

  get user(): IUser {
    return this.model
  }

  private get defaultUser(): IUser {
    return {
      idUser: 0,
      username: '',
      email: '@gmail.com',
      role: 'USER',
      phoneNumber: '',
      receiveNotifications: false,
      active: true,
    } as IUser
  }

  protected getDefault(data?: Partial<IUser>): IUser {
    return this.createWithDefaults(data || {}, this.defaultUser)
  }

  static formatBoolean(value?: boolean): string {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return value ? t('messages.yes') : t('messages.no')
  }

  static getHeaders(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)

    return [
      {
        title: t('dataTable.users.headers.id'),
        align: 'start',
        key: 'idUser',
        width: 50,
      },
      {
        title: t('dataTable.users.headers.username'),
        align: 'start',
        key: 'username',
        width: 250,
      },
      {
        title: t('dataTable.users.headers.email'),
        align: 'start',
        key: 'email',
        width: 200,
      },
      {
        title: t('dataTable.users.headers.role'),
        align: 'start',
        key: 'role',
        width: 'auto',
        maxWidth: 100,
      },
      {
        title: t('dataTable.users.headers.phoneNumber'),
        align: 'end',
        key: 'phoneNumber',
        width: 'auto',
        maxWidth: 200,
      },
      {
        title: t('dataTable.users.headers.receiveNotifications'),
        key: 'receiveNotifications',
        align: 'center',
        value: (item: IUser) => ClassUsers.formatBoolean(item.receiveNotifications),
        chartFormatter: ClassUsers.formatBoolean,
      },
      {
        title: t('dataTable.users.headers.active'),
        key: 'active',
        align: 'center',
        value: (item: IUser) => ClassUsers.formatBoolean(item.active),
        chartFormatter: ClassUsers.formatBoolean,
      },
      {
        title: t('dataTable.headersDefault.actions'),
        key: 'actions',
        align: 'center',
      },
    ]
  }
}
