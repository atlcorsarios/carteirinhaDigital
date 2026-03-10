import type { IModelBaseDialog } from './models/modelComponents/ModelBaseDialog'
import { BaseClass } from './subscriptions/BaseClass'

export class ClassBaseDialog<T = any> extends BaseClass<IModelBaseDialog<T>> {
  constructor(data?: Partial<IModelBaseDialog<T>>) {
    super(data)
  }

  static defaultDialog<T>(): IModelBaseDialog<T> {
    return {
      view: false,
      persistent: false,
      maxWidth: 400,
      maxHeight: 400,
      formEditingMode: false,
      itemEdition: null,
    }
  }

  protected getDefault(data: Partial<IModelBaseDialog<T>> = {}): IModelBaseDialog<T> {
    return this.createWithDefaults(data, ClassBaseDialog.defaultDialog<T>())
  }

  openNew(data?: Partial<T>) {
    this.model.formEditingMode = false
    this.model.itemEdition = (data as T) || null
    this.model.view = true
  }

  openEditingMode(item: T) {
    this.model.formEditingMode = true
    this.model.itemEdition = { ...item }
    this.model.view = true
  }

  toggleDialog() {
    this.model.view = !this.model.view
  }
}
