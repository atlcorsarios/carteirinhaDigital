import type { IHeadersDataTable } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IIngredientsInRevenue } from '../models/ModelIProduct'
import { BaseClass } from '../subscriptions/BaseClass'
import { ClassIngredients } from './ClassIngredients'
import { i18n } from '@/plugins/i18n'

export class ClassIngredientsInRevenue extends BaseClass<IIngredientsInRevenue> {
  constructor(data?: Partial<IIngredientsInRevenue>) {
    super(data)
  }

  static defaultIngredientsInRevenue(): IIngredientsInRevenue {
    return {
      amount: 0,
      ingredient: ClassIngredients.defaultIngredient(),
    }
  }

  protected getDefault(data: unknown = {}): IIngredientsInRevenue {
    const item = data as Partial<IIngredientsInRevenue>
    return this.createWithDefaults(item, ClassIngredientsInRevenue.defaultIngredientsInRevenue())
  }

  static get headers(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return [
      {
        title: t('dataTable.revenues.ingredients.headers.id'),
        align: 'start',
        key: 'id',
        width: 50,
      },
    ]
  }

  static get filters(): IFilterColumn[] {
    return [
      {
        key: 'id',
        label: 'dataTable.revenues.ingredients.headers.id',
        type: 'number',
      },
    ]
  }
}
