import { StorageUtils } from '@/utils/StorageUtils'
import type { ILogin } from './models/ModelLogin'
import { BaseClass } from './subscriptions/BaseClass'

export class ClassLogin extends BaseClass<ILogin> {
  constructor(data?: Partial<ILogin>) {
    super(data)
  }

  static defaultLogin(): ILogin {
    const emailDefault = StorageUtils.get<string>('access_email', '@gmail.com', 'local')
    return {
      email: emailDefault || '',
      password: '',
    }
  }

  protected getDefault(data: Partial<ILogin> = {}): ILogin {
    return this.createWithDefaults(data, ClassLogin.defaultLogin())
  }

  reset() {
    const defaults = this.getDefault()
    Object.assign(this.model, defaults)
    StorageUtils.set('access_email', '@gmail.com', 'local')
  }

  saveEmailPreference() {
    StorageUtils.set('access_email', this.model.email, 'local')
  }
}
