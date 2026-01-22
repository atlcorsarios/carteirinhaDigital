export interface ICategory {
  id?: string | number
  description: string
}

export interface IRevenue {
  id?: string | number
  idProduct: string | number
  description: string
  ingredients: IIngredientsInRevenue[]
}

export interface IIngredient {
  id?: string | number
  description: string
  measurement: string
  stock: number
}

export interface IIngredientsInRevenue {
  amount: number
  ingredient: IIngredient
}

export interface IProduct {
  idProduct?: string | number
  productName: string
  image?: string
  price?: number
  active?: boolean
  category: ICategory
  revenue: IRevenue
}
