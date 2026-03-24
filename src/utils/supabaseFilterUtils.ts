import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter'
import type { IFilterColumn } from '@/classes/models/ModelFilterColumns'

export function applySupabaseFilters<T>(
  query: T | any,
  filters: IQueryFilter[],
  columnsConfig?: IFilterColumn[]
): T {
  if (!filters || filters.length === 0) return query

  filters.forEach((filter) => {
    const { field, condition, value, startDate, endDate, selectValues } = filter
    const columnDef = columnsConfig?.find(c => c.key === field)

    let parsedValue: string | boolean | number = value

    if (columnDef?.type === 'boolean') {
      parsedValue = (value === 'true')
    } else if (columnDef?.type === 'number' && value !== null && value !== '') {
      parsedValue = Number(value)
    }

    switch (condition) {
      case 'startsIn':
        query = query.ilike(field, `${parsedValue}%`)
        break
      case 'endsIn':
        query = query.ilike(field, `%${parsedValue}`)
        break
      case 'contains':
        query = query.ilike(field, `%${parsedValue}%`)
        break
      case 'equals':
        query = query.eq(field, parsedValue)
        break
      case 'notEquals':
        query = query.neq(field, parsedValue)
        break
      case 'greaterEqual':
        query = query.gte(field, parsedValue)
        break
      case 'greaterThan':
        query = query.gt(field, parsedValue)
        break
      case 'lessEqual':
        query = query.lte(field, parsedValue)
        break
      case 'lessThan':
        query = query.lt(field, parsedValue)
        break
      case 'between':
        if (startDate && endDate) {
          query = query.gte(field, startDate).lte(field, endDate)
        }
        break
      case 'select':
        if (selectValues && selectValues.length > 0) {
          query = query.in(field, selectValues)
        }
        break
      case 'except':
        if (selectValues && selectValues.length > 0) {
          query = query.not(field, 'in', `(${selectValues.join(',')})`)
        }
        break
      default:
        query = query.eq(field, parsedValue)
        break
    }
  })

  return query
}
