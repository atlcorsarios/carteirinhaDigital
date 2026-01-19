import type { INotifications } from './models/ModelNotifications'
import { FALLBACK_LOCALE } from "@/plugins/i18n";
import { formattedDate } from '@/utils/formattedDate';
import { reactive } from 'vue'

export class ClassNotifications {
  private notifications: INotifications[];

  constructor(data?: Partial<INotifications>[]) {
    this.notifications = reactive(this.getDefault(data));
  }

  get model() {
    return this.notifications;
  }

  private createNotification(data: Partial<INotifications> = {}): INotifications {
    const today = new Date();
    const locale = typeof navigator !== 'undefined' ? navigator.language : FALLBACK_LOCALE;
    const defaults = {
      id: data?.id || 0,
      title: data?.title || '',
      description: data?.description || '',
      message: data?.message || '',
      date: data?.date || formattedDate(today, locale),
      seen: data?.seen || false,
      sender: data?.sender || '',
      recipients: data?.recipients || [],
      origin: data?.origin || ''
    } as INotifications;

    return { ...defaults, ...data };
  }

  private getDefault(data?: Partial<INotifications>[]): INotifications[] {
    if (data && data.length > 0) {
      return data.map(item => this.createNotification(item));
    }

    return [];
  }

}
