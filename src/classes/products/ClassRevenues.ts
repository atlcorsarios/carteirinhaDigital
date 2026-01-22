import { ClassIngredientsInRevenue } from './ClassIngredientsInRevenue'
import type { IHeadersDataTable } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IRevenue } from '../models/ModelIProduct'
import { BaseClass } from '../subscriptions/BaseClass'
import { i18n } from '@/plugins/i18n'

export class ClassRevenues extends BaseClass<IRevenue> {
  constructor(data?: Partial<IRevenue>) {
    super(data)
  }

  static defaultRevenue(): IRevenue {
    return {
      id: 0,
      idProduct: 0,
      description: '',
      ingredients: [ClassIngredientsInRevenue.defaultIngredientsInRevenue()],
    }
  }

  protected getDefault(data: unknown = {}): IRevenue {
    const item = data as Partial<IRevenue>
    return this.createWithDefaults(item, ClassRevenues.defaultRevenue())
  }

  static getHeaders(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return [
      {
        title: t('dataTable.revenues.headers.id'),
        align: 'start',
        key: 'id',
        width: 50,
      },
    ]
  }

  static getFilterColumn(): IFilterColumn[] {
    return [
      {
        key: 'id',
        label: 'dataTable.revenues.headers.id',
        type: 'number',
      },
    ]
  }
}
