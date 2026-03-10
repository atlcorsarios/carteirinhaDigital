import type { INotification } from "./models/ModelNotifications";
import { BaseClass } from "./subscriptions/BaseClass";

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
      date: new Date()
    }
  }

  protected getDefault(data: unknown = {}): INotification {
    const item = data as Partial<INotification>
    return this.createWithDefaults(item, ClassNotifications.defaultNotification())
  }

}
