import type { TDefinitionsForQueryFilter } from './models/modelComponents/ModelQueryFilter'
import { ClassNotifications } from './ClassNotifications'
import { ClassProducts } from './products/ClassProducts'
import { ClassUsers } from './ClassUsers'

export class ClassDefinitions {
  static get queryFilterUsers(): TDefinitionsForQueryFilter {
    return {
      filters: ClassUsers.filters,
      defaultFilter: ClassUsers.defaultFilterConfig,
    }
  }

  static get queryFilterProducts(): TDefinitionsForQueryFilter {
    return {
      filters: ClassProducts.filters,
      defaultFilter: ClassProducts.defaultFilterConfig,
    }
  }

  static get queryFilterNotifications(): TDefinitionsForQueryFilter {
    return {
      filters: ClassNotifications.filters,
      defaultFilter: ClassNotifications.defaultFilterConfig,
    }
  }
}
