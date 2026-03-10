import { type ICategory } from './ModelIProduct'

export interface IStock {
  idStock: number
  category: ICategory
  description: string
  measurement: string
  amount: number
}

export const operations = ['ENTRY', 'EXIT'] as const
export type TOperationsStock = (typeof operations)[number]

export const OPERATIONS_TRANSLATIONS: Record<TOperationsStock, string> = {
  ENTRY: 'forms.formStock.operation.types.entry',
  EXIT: 'forms.formStock.operation.types.exit'
}

export interface IStockControl<T> {
  item: T
  operation: TOperationsStock
  measurement: string
  amount: number
  price?: number
  date?: Date
}
