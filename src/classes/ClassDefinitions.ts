import type { TDefinitionsForQueryFilter } from './models/modelComponents/ModelQueryFilter'
import { ClassUsuarios } from './resources/ClassUsuarios'
import { ClassParceiros } from './resources/ClassParceiros'
import { ClassProdutos } from './resources/ClassProdutos'

export class ClassDefinitions {
  static get queryFilterUsers(): TDefinitionsForQueryFilter {
    return {
      filters: ClassUsuarios.filters,
      defaultFilter: ClassUsuarios.defaultFilterConfig,
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
      filters: ClassProdutos.filters,
      defaultFilter: ClassProdutos.defaultFilterConfig,
    }
  }
}
