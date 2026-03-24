import type { IFilterColumn } from '../ModelFilterColumns'

export interface IQueryFilter {
  field: string
  condition: string
  value: string
  startDate?: Date | string
  endDate?: Date | string
  selectValues?: any[]
}

export interface IQueryFilterOptions {
  columns?: IFilterColumn[]
  storageContext?: string
  defaultFilter?: Partial<IQueryFilter>
}

export type TDefinitionsForQueryFilter = {
  filters: IFilterColumn[]
  defaultFilter: Partial<IQueryFilter>
}
