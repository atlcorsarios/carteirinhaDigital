import type { IModelBaseDialog } from './models/modelComponents/ModelBaseDialog'
import { BaseClass } from './subscriptions/BaseClass'

export class ClassBaseDialog<T = any> extends BaseClass<IModelBaseDialog<T>> {
  constructor(data?: Partial<IModelBaseDialog<T>>) {
    super(data)
  }

  get dialog() {
    return this.model
  }

  private get defaultDailog(): IModelBaseDialog<T> {
    return {
      view: false,
      persistent: false,
      maxWidth: 400,
      maxHeight: 400,
      formEditingMode: false,
      itemEdition: null,
    } as IModelBaseDialog<T>
  }

  protected getDefault(data?: Partial<IModelBaseDialog<T>>): IModelBaseDialog<T> {
    return this.createWithDefaults(data || {}, this.defaultDailog)
  }

  openNew() {
    this.dialog.formEditingMode = false
    this.dialog.itemEdition = null
    this.dialog.view = true
  }

  openEditingMode(item: T) {
    this.dialog.formEditingMode = true
    this.dialog.itemEdition = { ...item }
    this.dialog.view = true
  }

  toggleDialog() {
    this.dialog.view = !this.dialog.view
  }
}
