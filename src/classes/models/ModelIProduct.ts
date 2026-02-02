export const validCategoriesGroups = ['PRODUCTS', 'RECIPES', 'INGREDIENTS'] as const;
export type TCategoryGroups = typeof validCategoriesGroups[number];

export const GROUP_TRANSLATIONS: Record<TCategoryGroups, string> = {
  PRODUCTS: 'forms.formCategory.group.types.products',
  RECIPES: 'forms.formCategory.group.types.recipes',
  INGREDIENTS: 'forms.formCategory.group.types.ingredients'
}

export interface ICategory {
  idCategory?: number
  description: string
  group: TCategoryGroups
  active: boolean
}

export interface IRecipe {
  idRecipe?: number
  description: string
  preparation: string
  ingredients: IIngredientsInRecipe[]
  category: ICategory
  active: boolean
}

export interface IIngredient {
  idIngredient?: number
  description: string
  measurement: string
  price?: number
  stock: number
  category: ICategory
}

export interface IIngredientsInRecipe {
  idRecipe: number
  amount: number
  ingredient: IIngredient
}

export interface IProduct {
  idProduct?: number
  description: string
  image?: string | null
  imageFile?: File | null
  price?: number
  active?: boolean
  category: ICategory
  recipe: IRecipe
}
