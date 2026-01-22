import { ClassCategories } from './ClassCategories'
import { ClassRevenues } from './ClassRevenues'
import type { IHeadersDataTable } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IProduct } from '../models/ModelIProduct'
import { BaseClass } from '../subscriptions/BaseClass'
import { i18n } from '@/plugins/i18n'

export class ClassProducts extends BaseClass<IProduct> {
  constructor(data?: Partial<IProduct>) {
    super(data)
  }

  static defaultProduct(): IProduct {
    return {
      id: 0,
      productName: '',
      image: '',
      price: 0.0,
      active: true,
      category: ClassCategories.defaultCategory(),
      revenue: ClassRevenues.defaultRevenue(),
    }
  }

  protected getDefault(data: unknown = {}): IProduct {
    const item = data as Partial<IProduct>
    return this.createWithDefaults(item, ClassProducts.defaultProduct())
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
      {
        title: t('dataTable.products.headers.productName'),
        align: 'start',
        key: 'productName',
        width: 200,
      },
    ]
  }

  static getFilterColumn(): IFilterColumn[] {
    return [
      {
        key: 'id',
        label: 'forms.formProduct.id',
        type: 'number',
      },
    ]
  }
}
