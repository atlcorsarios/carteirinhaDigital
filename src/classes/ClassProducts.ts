import type { IHeadersDataTable } from './models/modelComponents/ModelHeaderTable'
import type { FilterColumn } from './models/ModelFilterColumns'
import type { IProduct } from './models/ModelIProduct'
import { BaseClass } from './subscriptions/BaseClass'
import { i18n } from '@/plugins/i18n'

export class ClassProducts extends BaseClass<IProduct[]> {
  constructor(data?: Partial<IProduct>[]) {
    super(data as any)
  }

  private get defaultItem(): IProduct {
    return {
      id: 0,
      productName: '',
    } as IProduct
  }

  protected getDefault(data?: unknown): IProduct[] {
    const items = (data as Partial<IProduct>[]) || []
    if (items.length === 0) return []
    return items.map((item) => this.createWithDefaults(item, this.defaultItem))
  }

  static getHeaders(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return [
      {
        title: t('dataTable.products.headers.id'),
        align: 'start',
        key: 'idProduct',
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

  static getFilterColumn(): FilterColumn[] {
    return [
      {
        key: 'id',
        label: 'forms.formProduct.id',
        type: 'number'
      }
    ]
  }
}
