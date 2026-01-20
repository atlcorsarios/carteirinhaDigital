import { reactive } from 'vue'
import type { IHeadersDataTable } from '../models/modelComponents/ModelHeaderTable'

export abstract class BaseClass<T extends object> {
  private _model: T

  constructor(data?: Partial<T>) {
    this._model = reactive(this.getDefault(data)) as T
  }

  get model(): T {
    return this._model
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
      Object.keys(this._model).forEach((key) => {
        // @ts-ignore
        delete this._model[key]
      })
      Object.assign(this._model, defaults)
    }
  }

  static getHeaders(): IHeadersDataTable[] {
    throw new Error("The static method 'getHeaders' must be implemented in the child class.")
  }
}
