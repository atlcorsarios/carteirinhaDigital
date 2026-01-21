import type { IHeadersDataTable } from "../models/modelComponents/ModelHeaderTable";
import type { FilterColumn } from "../models/ModelFilterColumns";
import type { IIngredient } from "../models/ModelIProduct";
import { BaseClass } from "../subscriptions/BaseClass";
import { i18n } from '@/plugins/i18n'

export class ClassIngredients extends BaseClass<IIngredient> {
  constructor(data?: Partial<IIngredient>) {
    super(data)
  }

  static defaultIngredient(): IIngredient {
    return {
      id: 0,
      description: '',
      measurement: '',
      stock: 0.0
    }
  }

  protected getDefault(data: unknown = {}): IIngredient {
    const item = data as Partial<IIngredient>
    return this.createWithDefaults(item, ClassIngredients.defaultIngredient())
  }

  static getHeaders(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return [
      {
        title: t('dataTable.products.headers.id'),
        align: 'start',
        key: 'id',
        width: 50,
      },
    ]
  }

  static getFilterColumn(): FilterColumn[] {
    return [
      {
        key: 'id',
        label: 'forms.formProduct.id',
        type: 'number',
      },
    ]
  }
}
