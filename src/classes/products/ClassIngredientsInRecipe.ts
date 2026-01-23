import type { IHeadersDataTable } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IIngredientsInRecipe } from '../models/ModelIProduct'
import { BaseClass } from '../subscriptions/BaseClass'
import { ClassIngredients } from './ClassIngredients'
import { i18n } from '@/plugins/i18n'

export class ClassIngredientsInRecipe extends BaseClass<IIngredientsInRecipe> {
  constructor(data?: Partial<IIngredientsInRecipe>) {
    super(data)
  }

  static defaultIngredientsInRecipe(): IIngredientsInRecipe {
    return {
      amount: 0,
      ingredient: ClassIngredients.defaultIngredient(),
    }
  }

  protected getDefault(data: unknown = {}): IIngredientsInRecipe {
    const item = data as Partial<IIngredientsInRecipe>
    return this.createWithDefaults(item, ClassIngredientsInRecipe.defaultIngredientsInRecipe())
  }

  static get headers(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return [
      {
        title: t('dataTable.recipes.ingredients.headers.id'),
        align: 'start',
        key: 'id',
        width: 50,
      },
    ]
  }

  static get filters(): IFilterColumn[] {
    return [
      {
        key: 'id',
        label: 'dataTable.recipes.ingredients.headers.id',
        type: 'number',
      },
    ]
  }
}
