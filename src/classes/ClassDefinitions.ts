import type { TDefinitionsForQueryFilter } from './models/modelComponents/ModelQueryFilter'
import { ClassProducts } from './ClassProducts'
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
}
