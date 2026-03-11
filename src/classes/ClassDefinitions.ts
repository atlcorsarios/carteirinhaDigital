import type { TDefinitionsForQueryFilter } from './models/modelComponents/ModelQueryFilter'
import { ClassProducts } from './resources/ClassProducts'
import { ClassUsers } from './resources/ClassUsers'

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
