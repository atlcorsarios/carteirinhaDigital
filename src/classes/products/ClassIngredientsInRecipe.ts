import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IIngredientsInRecipe } from '../models/ModelIProduct'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'
import { ClassIngredients } from './ClassIngredients'
import { BaseClass } from '../subscriptions/BaseClass'
import { ClassFormatters } from '../ClassFormatters'

export class ClassIngredientsInRecipe extends BaseClass<IIngredientsInRecipe> {
  constructor(data?: Partial<IIngredientsInRecipe>) {
    super(data)
  }

  static defaultIngredientsInRecipe(): IIngredientsInRecipe {
    return {
      idRecipe: 1,
      amount: 0,
      ingredient: ClassIngredients.defaultIngredient(),
    }
  }

  protected getDefault(data: unknown = {}): IIngredientsInRecipe {
    const item = data as Partial<IIngredientsInRecipe>
    return this.createWithDefaults(item, ClassIngredientsInRecipe.defaultIngredientsInRecipe())
  }

  static get fieldConfig(): TEntityConfig<IIngredientsInRecipe> {
    return {
      idRecipe: {
        width: 50,
        maxWidth: 100,
        minWidth: 50
      },
      amount: {
        width: 50,
        maxWidth: 100,
        minWidth: 50,
        chartFormatter: ClassFormatters.formatAmountIngredient,
        value: (item: IIngredientsInRecipe) => ClassFormatters.formatAmountIngredient(item.amount, item.ingredient.measurement)
      },
      ingredient: {
        hidden: true
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassIngredientsInRecipe().getDefault()
    const autoHeaders = BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formIngredientInRecipe',
      ClassIngredientsInRecipe.fieldConfig
    )

    autoHeaders.push({
      key: 'ingredient.description',
      title: 'forms.formIngredientInRecipe.ingredients',
      align: 'center',
      width: 200,
      maxWidth: 750,
      minWidth: 150,
      dataType: 'text'
    })

    return autoHeaders;
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassIngredientsInRecipe().getDefault()
    const autoFilters = BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formIngredientInRecipe',
      ClassIngredientsInRecipe.fieldConfig
    )

    autoFilters.push({
      key: 'ingredient.description',
      label: 'forms.formIngredientsInRecipe.ingredients.headerTable',
      type: 'text',
    })

    autoFilters.push({
      key: 'ingredient.category.description',
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
