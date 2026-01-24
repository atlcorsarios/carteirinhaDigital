import { ClassIngredientsInRecipe } from './ClassIngredientsInRecipe'
import type { IHeadersDataTable } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IRecipe } from '../models/ModelIProduct'
import { BaseClass } from '../subscriptions/BaseClass'
import { i18n } from '@/plugins/i18n'
import { ClassCategories } from './ClassCategories'

export class ClassRecipes extends BaseClass<IRecipe> {
  constructor(data?: Partial<IRecipe>) {
    super(data)
  }

  static defaultRecipe(): IRecipe {
    return {
      idRecipe: 0,
      idProduct: 0,
      description: '',
      ingredients: [ClassIngredientsInRecipe.defaultIngredientsInRecipe()],
      category: { ...ClassCategories.defaultCategory(), group: 'RECIPES' }
    }
  }

  protected getDefault(data: unknown = {}): IRecipe {
    const item = data as Partial<IRecipe>
    return this.createWithDefaults(item, ClassRecipes.defaultRecipe())
  }

  static get headers(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)
    return [
      {
        title: t(''),
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
        label: '',
        type: 'number',
      },
    ]
  }
}
