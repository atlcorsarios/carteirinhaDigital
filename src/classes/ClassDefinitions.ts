import { ClassNotifications } from './ClassNotifications'
import { ClassProducts } from './products/ClassProducts'
import { ClassUsers } from './ClassUsers'
import type { IFilterColumn } from './models/ModelFilterColumns'

export class ClassDefinitions {
  static get getFilterColumnsUsers(): IFilterColumn[] {
    return ClassUsers.getFilterColumns
  }

  static get getFilterColumnsProducts(): IFilterColumn[] {
    return ClassProducts.getFilterColumn()
  }

  static get getFilterColumnsNotifications(): IFilterColumn[] {
    return ClassNotifications.getFilterColumn()
  }
}
