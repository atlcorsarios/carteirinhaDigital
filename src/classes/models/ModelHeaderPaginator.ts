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
