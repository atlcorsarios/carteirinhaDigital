import type { IFilterColumn } from '../ModelFilterColumns'

export interface IHeadersDataTable {
  title: string
  key: string
  align?: 'start' | 'end' | 'center'
  height?: string | number
  maxHeight?: string | number
  width?: string | number
  maxWidth?: string | number
  sortable?: boolean
  chartAggregator?: 'sum' | 'count'
  chartFormatter?: (value?: any) => string
  value?: (item: any) => any
}

export type TConfigHeaders = Omit<IHeadersDataTable, 'title' | 'key'>

export interface IFieldConfig extends TConfigHeaders {
  hidden?: boolean
  excludeFromHeader?: boolean
  excludeFromFilter?: boolean
  filterType?: IFilterColumn['type']
  selectOptions?: IFilterColumn['options']
  filterLabelKey?: string
}

export type TEntityConfig<T> = Partial<Record<keyof T | 'actions', IFieldConfig>>
