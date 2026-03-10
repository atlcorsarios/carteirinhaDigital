import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IIngredient } from '../models/ModelIProduct'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'
import { ClassCategories } from './ClassCategories'
import { BaseClass } from '../subscriptions/BaseClass'
import { ClassFormatters } from '../ClassFormatters'

export class ClassIngredients extends BaseClass<IIngredient> {
  constructor(data?: Partial<IIngredient>) {
    super(data)
  }

  static defaultIngredient(): IIngredient {
    return {
      idIngredient: 0,
      description: '',
      measurement: '',
      price: undefined,
      stock: 0.0,
      category: { ...ClassCategories.defaultCategory(), group: 'INGREDIENTS' }
    }
  }

  protected getDefault(data: unknown = {}): IIngredient {
    const item = data as Partial<IIngredient>
    return this.createWithDefaults(item, ClassIngredients.defaultIngredient())
  }

  static get fieldConfig(): TEntityConfig<IIngredient> {
    return {
      idIngredient: {
        width: 50,
        maxWidth: 100,
        minWidth: 30,
        excludeFromChart: true
      },
      description: {
        align: 'center',
        width: 500,
        maxWidth: 750,
        minWidth: 250,
        excludeFromChart: true
      },
      measurement: {
        align: 'center',
        width: 150,
        maxWidth: 250,
        minWidth: 100,
      },
      price: {
        align: 'end',
        width: 350,
        maxWidth: 450,
        minWidth: 100,
        chartFormatter: ClassFormatters.formatPriceDynamic,
        value: (item) => ClassFormatters.formatPriceDynamic(item.price),
      },
      stock: {
        align: 'center',
        width: 250,
        maxWidth: 400,
        minWidth: 150,
      },
      category: {
        hidden: true
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassIngredients().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formIngredient',
      ClassIngredients.fieldConfig
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassIngredients().getDefault()
    const autoFilters = BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formIngredient',
      ClassIngredients.fieldConfig
    )

    autoFilters.push({
      key: 'category.description',
      label: 'forms.formIngredient.category.headerTable',
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
