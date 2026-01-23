import type { IQueryFilter, IQueryFilterOptions } from './models/modelComponents/ModelQueryFilter'
import { OPERATORS, type IFilterColumn } from './models/ModelFilterColumns'
import { formattedDate } from '@/utils/formattedDate'
import { StorageUtils } from '@/utils/StorageUtils'
import { BaseClass } from './subscriptions/BaseClass'
import { FALLBACK_LOCALE } from '@/locales/definitionsLocales'
import { useRoute } from 'vue-router'
import { reactive, ref, watch } from 'vue'

export class ClassQueryFilter extends BaseClass<IQueryFilter[]> {
  private staging: IQueryFilter
  private defaultConfiguration: Partial<IQueryFilter> = {}
  private availableColumns = ref<IFilterColumn[]>([])
  private storageKey: string = ''

  constructor(data?: Partial<IQueryFilter>[], options?: Partial<IQueryFilterOptions>) {
    super(data as any)
    this.staging = reactive(this.createWithDefaults({}, ClassQueryFilter.defaultQuery()))
    const route = useRoute()

    if (options?.columns) {
      this.availableColumns.value = options.columns
    } else {
      watch(() => route.meta?.filterConfig, (newConfig) => {
          this.availableColumns.value = (newConfig as IFilterColumn[]) || []
        },
        { immediate: true }
      )
    }

    if (options?.storageContext) {
      this.storageKey = `filter_context_${options.storageContext}`
      this.loadFromStorage()
      this.resetStaging()
    } else {
      watch(() => route.name, (newName) => {
          if (!newName) return

          this.storageKey = `filter_context_${String(newName)}`
          this.loadFromStorage()
          this.resetStaging()
        },
        { immediate: true },
      )
    }

    if (options?.defaultFilter) {
      this.defaultConfiguration = options.defaultFilter
    }
    else if (route.meta?.defaultFilterConfig) {
      this.defaultConfiguration = route.meta.defaultFilterConfig as Partial<IQueryFilter>
    }

    watch(() => this.model, (newVal) => {
        if (this.storageKey) {
          StorageUtils.set(this.storageKey, newVal, 'session')
        }
      },
      { deep: true },
    )

    this.resetStaging()
  }

  get stagingModel(): IQueryFilter {
    return this.staging
  }

  set stagingModel(value: IQueryFilter) {
    Object.keys(this.staging).forEach((k) => delete (this.staging as any)[k])
    Object.assign(this.staging, value)
  }

  get filters(): IFilterColumn[] {
    return this.availableColumns.value
  }

  static defaultQuery(): IQueryFilter {
    const today = new Date()
    const locale = typeof navigator !== 'undefined' ? navigator.language : FALLBACK_LOCALE
    const dateStr = formattedDate(today, locale)
    return {
      field: '',
      condition: '',
      value: '',
      startDate: dateStr,
      endDate: dateStr,
      selectValues: [],
    }
  }

  protected getDefault(data: unknown = []): IQueryFilter[] {
    const items = data as Partial<IQueryFilter>[]

    if (items.length > 0) {
      return items.map((item) => this.createWithDefaults(item, ClassQueryFilter.defaultQuery()))
    }

    return []
  }

  private loadFromStorage() {
    const savedData = StorageUtils.get<IQueryFilter[]>(this.storageKey, [], 'session')
    this.model.length = 0
    if (savedData && savedData.length > 0) {
      const cleanData = savedData.map((item) =>
        this.createWithDefaults(item, ClassQueryFilter.defaultQuery()),
      )
      this.model.push(...cleanData)
    }
  }

  private getSmartDefault(): Partial<IQueryFilter> {
    if (this.defaultConfiguration.field) {
      return { ...this.defaultConfiguration }
    }

    if (this.availableColumns.value.length > 0) {
      const firstCol = this.availableColumns.value[0]
      const firstOp = OPERATORS[firstCol.type]?.[0]?.value || 'equals'

      return {
        field: firstCol.key,
        condition: firstOp
      }
    }

    return { field: '', condition: '', value: '' }
  }

  addFilter(): boolean {
    if (this.isDuplicate(this.staging)) {
      return false
    }

    this.model.push(this.createWithDefaults(this.staging, ClassQueryFilter.defaultQuery()))
    this.resetStaging()
    return true
  }

  removeFilter(index: number) {
    if (this.model.length === 1) {
      this.reset()
    } else {
      this.model.splice(index, 1)
    }
  }

  reset() {
    this.model.length = 0
  }

  resetStaging(data: Partial<IQueryFilter> = {}) {
    const smartDefault = this.getSmartDefault()

    const baseData = {
      ...ClassQueryFilter.defaultQuery(),
      ...smartDefault,
      ...data
    }

    Object.keys(this.staging).forEach((key) => {
      // @ts-ignore
      delete this.staging[key]
    })
    Object.assign(this.staging, baseData)
  }

  private isDuplicate(newItem: IQueryFilter): boolean {
    return this.model.some(
      (existing) =>
        existing.field === newItem.field &&
        existing.condition === newItem.condition &&
        existing.value === newItem.value &&
        existing.startDate === newItem.startDate &&
        existing.endDate === newItem.endDate,
    )
  }

  getColumnType(key: string): IFilterColumn | undefined {
    return this.availableColumns.value.find((col) => col.key === key)
  }

  fieldChanged(data: Partial<IQueryFilter> = {}) {
    const newItem = this.createWithDefaults(data, ClassQueryFilter.defaultQuery())

    Object.keys(this.staging).forEach((key) => {
      // @ts-ignore
      delete this.staging[key]
    })
    Object.assign(this.staging, newItem)
  }

  updateStaging(data: Partial<IQueryFilter>) {
    Object.assign(this.staging, data)
  }
}
