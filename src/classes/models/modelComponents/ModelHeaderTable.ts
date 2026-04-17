import type { IFilterColumn } from '../ModelFilterColumns'

export interface IHeadersDataTable {
  title: string
  key?: string
  dataType?: 'text' | 'boolean' | 'currency' | 'date'
  cellClass?: (value: any, item: any) => string
  align?: 'start' | 'end' | 'center'
  height?: string | number
  maxHeight?: string | number
  minHeigth?: string | number
  width?: string | number
  maxWidth?: string | number
  minWidth?: string | number
  sortable?: boolean
  sort?: (a: any, b: any) => number;
  excludeFromChart?: boolean
  chartAggregator?: 'sum' | 'count'
  chartFormatter?: (value?: any, sufix?: any) => string
  value?: (item: any) => any
}

export type TConfigHeaders = Omit<IHeadersDataTable, 'title'>

export interface IFieldConfig extends TConfigHeaders {
  hidden?: boolean
  excludeFromHeader?: boolean
  excludeFromFilter?: boolean
  filterType?: IFilterColumn['type']
  selectOptions?: IFilterColumn['options']
  filterLabelKey?: string
}

export type TEntityConfig<T> = Partial<Record<keyof T | 'actions', IFieldConfig>>
