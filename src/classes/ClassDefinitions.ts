import { ClassNotifications } from "./ClassNotifications";
import { ClassProducts } from "./ClassProducts";
import { ClassUsers } from "./ClassUsers";
import type { FilterColumn } from "./models/ModelFilterColumns";

export class ClassDefinitions {
  static get getFilterColumnsUsers(): FilterColumn[] {
    return ClassUsers.getFilterColumns()
  }

  static get getFilterColumnsProducts(): FilterColumn[] {
    return ClassProducts.getFilterColumn()
  }

  static get getFilterColumnsNotifications(): FilterColumn[] {
    return ClassNotifications.getFilterColumn()
  }
}
