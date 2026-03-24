import type { IQueryFilter } from "./modelComponents/ModelQueryFilter"

export interface IHeaderPaginatorModel<T> {
  limit: number
  offset: number
  total?: number
  items: Array<T>
}

export type TPagination = {
  limit: number,
  offset: number,
  total: number,
  isFinished: boolean
}

export type TPayloadRequestPagination = {
  limit: number
  cursor: string | null
  filters: IQueryFilter[]
}
