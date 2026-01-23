export interface ICategory {
  idCategory?: number
  description: string
  active?: boolean
}

export interface IRecipe {
  idRecipe?: number
  idProduct: string | number
  description: string
  ingredients: IIngredientsInRecipe[]
}

export interface IIngredient {
  idIngredient?: number
  description: string
  measurement: string
  stock: number
}

export interface IIngredientsInRecipe {
  amount: number
  ingredient: IIngredient
}

export interface IProduct {
  idProduct?: string | number
  productName: string
  image?: string | null
  imageFile?: File | null
  price?: number
  active?: boolean
  category: ICategory
  recipe: IRecipe
}
