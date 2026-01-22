import type { IHeadersDataTable } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { ICategory } from '../models/ModelIProduct'
import { BaseClass } from '../subscriptions/BaseClass'
import { i18n } from '@/plugins/i18n'

export class ClassCategories extends BaseClass<ICategory> {
  constructor(data?: Partial<ICategory>) {
    super(data)
  }

  static defaultCategory(): ICategory {
    return {
      id: 0,
      description: '',
    }
  }

  protected getDefault(data: unknown = {}): ICategory {
    const item = data as Partial<ICategory>
    return this.createWithDefaults(item, ClassCategories.defaultCategory())
  }

  static getHeaders(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return [
      {
        title: t('dataTable.categories.headers.id'),
        align: 'start',
        key: 'id',
        width: 50,
      },
      {
        title: t('dataTable.categories.headers.description'),
        align: 'start',
        key: 'description',
        width: 200,
      },
    ]
  }

  static getFilterColumn(): IFilterColumn[] {
    return [
      {
        key: 'id',
        label: 'dataTable.categories.headers.id',
        type: 'number',
      },
      {
        key: 'description',
        label: 'dataTable.categories.headers.description',
        type: 'text',
      },
    ]
  }
}
