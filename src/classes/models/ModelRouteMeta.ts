import type { IFilterColumn } from './ModelFilterColumns'
import type { IQueryFilter } from './modelComponents/ModelQueryFilter'

export interface IRouteMeta {
  path: string
  name?: string
  title?: string
  icon?: string
  hotkey?: string
  hidden?: boolean
  requiresAuth?: boolean
  authorize?: string[]
  children?: IRouteMeta[]
  hasFilters?: boolean
  filterConfig?: IFilterColumn[]
  defaultFilterConfig?: Partial<IQueryFilter>
}
