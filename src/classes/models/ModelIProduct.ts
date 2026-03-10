export interface IProduct {
  idProduct?: number
  description: string
  image?: string | null
  imageFile?: File | null
  price?: number
  active?: boolean
}
