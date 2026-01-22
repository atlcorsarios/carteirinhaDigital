import { ClassCategories } from './ClassCategories'
import { ClassRevenues } from './ClassRevenues'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IProduct } from '../models/ModelIProduct'
import { BaseClass } from '../subscriptions/BaseClass'
import { ClassFormatters } from '../ClassFormatters'

export class ClassProducts extends BaseClass<IProduct> {
  constructor(data?: Partial<IProduct>) {
    super(data)
  }

  static defaultProduct(): IProduct {
    return {
      idProduct: 0,
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

  static get fieldConfig(): TEntityConfig<IProduct> {
    return {
      idProduct: {
        width: 50,
      },
      productName: {
        maxWidth: 250,
      },
      image: {
        hidden: true,
      },
      price: {
        align: 'end',
        maxWidth: 150,
        chartFormatter: ClassFormatters.formatPriceDynamic,
        value: (item) => ClassFormatters.formatPriceDynamic(item.price),
      },
      active: {
        align: 'center',
        chartFormatter: ClassFormatters.formatBoolean,
        value: (item) => ClassFormatters.formatBoolean(item.active),
        width: 50,
      },
      category: {
        hidden: true,
      },
      revenue: {
        hidden: true,
      },
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassProducts().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formProduct',
      ClassProducts.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassProducts().getDefault()
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formProduct',
      ClassProducts.fieldConfig,
    )
  }
}
