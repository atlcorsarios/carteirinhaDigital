import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IProduct } from '../models/ModelIProduct'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'
import { ClassCategories } from './ClassCategories'
import { ClassRecipes } from './ClassRecipes'
import { BaseClass } from '../subscriptions/BaseClass'
import { ClassFormatters } from '../ClassFormatters'

export class ClassProducts extends BaseClass<IProduct> {
  constructor(data?: Partial<IProduct>) {
    super(data)
  }

  static defaultProduct(): IProduct {
    return {
      idProduct: 0,
      description: '',
      image: '',
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
        excludeFromChart: true
      },
      description: {
        align: 'center',
        maxWidth: 250,
        excludeFromChart: true
      },
      image: {
        width: 60,
        excludeFromFilter: true,
        excludeFromChart: true
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
    const autoFilters = BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formProduct',
      ClassProducts.fieldConfig,
    )

    autoFilters.push({
      key: 'category.description',
      label: 'forms.formProduct.category.headerTable',
      type: 'text',
    })

    autoFilters.push({
      key: 'recipe.description',
      label: 'forms.formProduct.recipe.headerTable',
      type: 'text',
    })

    return autoFilters;
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'description',
      condition: 'contains'
    }
  }
}
