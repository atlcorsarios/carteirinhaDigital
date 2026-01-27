import type { TDefinitionsForQueryFilter } from './models/modelComponents/ModelQueryFilter'
import { ClassNotifications } from './ClassNotifications'
import { ClassProducts } from './products/ClassProducts'
import { ClassUsers } from './ClassUsers'
import { ClassCategories } from './products/ClassCategories'
import { ClassRecipes } from './products/ClassRecipes'

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

  static get queryFilterCategories(): TDefinitionsForQueryFilter {
    return {
      filters: ClassCategories.filters,
      defaultFilter: ClassCategories.defaultFilterConfig
    }
  }

  static get queryFilterRecipes(): TDefinitionsForQueryFilter {
    return {
      filters: ClassRecipes.filters,
      defaultFilter: ClassRecipes.defaultFilterConfig
    }
  }

  static get queryFilterNotifications(): TDefinitionsForQueryFilter {
    return {
      filters: ClassNotifications.filters,
      defaultFilter: ClassNotifications.defaultFilterConfig,
    }
  }
}
