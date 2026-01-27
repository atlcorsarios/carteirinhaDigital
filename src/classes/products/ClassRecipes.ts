import { ClassIngredientsInRecipe } from './ClassIngredientsInRecipe'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IRecipe } from '../models/ModelIProduct'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'
import { ClassCategories } from './ClassCategories'
import { BaseClass } from '../subscriptions/BaseClass'
import { ClassFormatters } from '../ClassFormatters'

export class ClassRecipes extends BaseClass<IRecipe> {
  constructor(data?: Partial<IRecipe>) {
    super(data)
  }

  static defaultRecipe(): IRecipe {
    return {
      idRecipe: 0,
      description: '',
      preparation: '',
      ingredients: [],
      category: { ...ClassCategories.defaultCategory(), group: 'RECIPES' },
      active: true
    }
  }

  protected getDefault(data: unknown = {}): IRecipe {
    const item = data as Partial<IRecipe>
    return this.createWithDefaults(item, ClassRecipes.defaultRecipe())
  }

  static get fieldConfig(): TEntityConfig<IRecipe> {
    return {
      idRecipe: {
        width: 50,
        maxWidth: 100,
        minWidth: 50,
        excludeFromChart: true
      },
      description: {
        width: 500,
        maxWidth: 750,
        minWidth: 100,
        excludeFromChart: true
      },
      preparation: {
        hidden: true
      },
      ingredients: {
        hidden: true
      },
      category: {
        hidden: true
      },
      active: {
        align: 'center',
        chartFormatter: ClassFormatters.formatBoolean,
        value: (item) => ClassFormatters.formatBoolean(item.active),
        width: 250,
        maxWidth: 300,
        minWidth: 50
      },
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassRecipes().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formRecipe',
      ClassRecipes.fieldConfig
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassRecipes().getDefault()
    const autoFilters = BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formRecipe',
      ClassRecipes.fieldConfig
    )

    autoFilters.push({
      key: 'category.description',
      label: 'forms.formRecipe.category.headerTable',
      type: 'text'
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
