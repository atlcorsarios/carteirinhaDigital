import type { TDefinitionsForQueryFilter } from './models/modelComponents/ModelQueryFilter'
import { ClassUsers } from './resources/ClassUsers'
import { ClassParceiros } from './resources/ClassParceiros'
import { ClassProducts } from './resources/ClassProducts'

export class ClassDefinitions {
  static get queryFilterUsers(): TDefinitionsForQueryFilter {
    return {
      filters: ClassUsers.filters,
      defaultFilter: ClassUsers.defaultFilterConfig,
    }
  }

  static get queryFilterParceiros(): TDefinitionsForQueryFilter {
    return {
      filters: ClassParceiros.filters,
      defaultFilter: ClassParceiros.defaultFilterConfig,
    }
  }

  static get queryFilterProducts(): TDefinitionsForQueryFilter {
    return {
      filters: ClassProducts.filters,
      defaultFilter: ClassProducts.defaultFilterConfig,
    }
  }
}
