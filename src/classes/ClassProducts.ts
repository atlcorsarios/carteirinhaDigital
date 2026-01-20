import type { IHeadersDataTable } from './models/modelComponents/ModelHeaderTable'
import type { IProduct } from './models/ModelIProduct'
import { BaseClass } from './subscriptions/BaseClass'
import { i18n } from '@/plugins/i18n'

export class ClassProducts extends BaseClass<IProduct[]> {
  constructor(data?: Partial<IProduct>[]) {
    super(data as any)
  }

  get products(): IProduct[] {
    return this.model
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
}
