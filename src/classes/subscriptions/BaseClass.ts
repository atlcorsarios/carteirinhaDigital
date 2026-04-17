import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import { i18n } from '@/plugins/i18n'
import { reactive } from 'vue'

export abstract class BaseClass<T extends object> {
  private _model: T

  constructor(data?: Partial<T>) {
    this._model = reactive(this.getDefault(data)) as T
  }

  get model(): T {
    return this._model
  }

  set model(value: T) {
    this.updateModel(value)
  }

  protected createWithDefaults<S extends object>(data: Partial<S>, defaultModel: S): S {
    const result = { ...defaultModel }

    Object.keys(data).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(defaultModel, key)) {
        // @ts-ignore
        result[key] = data[key]
      }
    })
    return result
  }

  protected abstract getDefault(data?: Partial<T>): T

  public updateModel(data: T): void {
    if (Array.isArray(this._model) && Array.isArray(data)) {
      this._model.length = 0
      this._model.push(...data)
    } else {
      Object.assign(this._model, data)
    }
  }

  public reset(): void {
    const defaults = this.getDefault()

    if (Array.isArray(this._model) && Array.isArray(defaults)) {
      this._model.length = 0
      this._model.push(...defaults)
    } else {
      Object.assign(this._model, defaults)
      Object.keys(this._model).forEach(key => {
        if (!(key in defaults)) {
          // @ts-ignore
          this._model[key] = undefined
        }
      })
    }
  }

  protected static generateHeadersFromModel<T extends object>(
    defaultModel: T,
    i18nPrefix: string,
    config: TEntityConfig<T> = {},
    moreHeaders?: IHeadersDataTable[]
  ): IHeadersDataTable[] {
    //@ts-ignore
    const t = (key: string) => i18n.global.t(key)
    const headers: IHeadersDataTable[] = []
    const keys = Object.keys(defaultModel as object) as (keyof T)[]

    keys.forEach((key) => {
      const conf = config[key]

      if (conf?.hidden || conf?.excludeFromHeader) return

      headers.push({
        title: t(`${i18nPrefix}.${String(key)}.headerTable`),
        key: String(key),
        dataType: conf?.filterType === 'boolean' || typeof defaultModel[key] === 'boolean' ? 'boolean' : 'text',
        ...conf,
        align: conf?.align || 'start',
      })
    })

    if (moreHeaders && moreHeaders.length > 0) {
      moreHeaders.forEach(customHeader => {
        headers.push({
          ...customHeader,
          title: customHeader.title ? t(customHeader.title) : customHeader.title
        })
      })
    }

    if (!config['actions']?.hidden) {
      headers.push({
        title: t('dataTable.headersDefault.actions'),
        key: 'actions',
        align: 'center',
        ...config['actions'],
      })
    }

    return headers
  }

  protected static generateFiltersFromModel<T extends object>(
    defaultModel: T,
    i18nPrefix: string,
    config: TEntityConfig<T> = {},
    moreFilters?: IFilterColumn[]
  ): IFilterColumn[] {
    const filters: IFilterColumn[] = []
    const keys = Object.keys(defaultModel as object) as (keyof T)[]

    keys.forEach((key) => {
      const conf = config[key]
      if (conf?.hidden || conf?.excludeFromFilter) return

      let type = conf?.filterType

      if (!type) {
        const value = defaultModel[key]
        if (typeof value === 'boolean') type = 'boolean'
        else if (typeof value === 'number') type = 'number'
        else type = 'text'
      }

      filters.push({
        key: String(key),
        label: conf?.filterLabelKey || `${i18nPrefix}.${String(key)}.headerTable`,
        type: type as any,
        options: conf?.selectOptions,
      })
    })

    if (moreFilters && moreFilters.length > 0) {
      filters.push(...moreFilters)
    }

    return filters
  }
}
