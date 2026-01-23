import { ClassCategories } from './ClassCategories'
import { ClassRecipes } from './ClassRecipes'
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
      image:
        'https://imgs.search.brave.com/lDiW-1b5kOsYRosEPnXWw06Shr1RFjwCkeiXswevt70/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnNz/dGF0aWMubmV0L3lt/ZndPLnBuZw',
      imageFile: null,
      price: undefined,
      active: true,
      category: ClassCategories.defaultCategory(),
      recipe: ClassRecipes.defaultRecipe(),
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
        excludeFromFilter: true,
      },
      imageFile: {
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
      recipe: {
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
