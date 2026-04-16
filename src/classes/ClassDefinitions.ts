import type { TDefinitionsForQueryFilter } from './models/modelComponents/ModelQueryFilter'
import { ClassUsuarios } from './resources/ClassUsuarios'
import { ClassParceiros } from './resources/ClassParceiros'
import { ClassProdutos } from './resources/ClassProdutos'
import { ClassBeneficios } from './resources/ClassBeneficios'
import { ClassPromocoes } from './resources/ClassPromocoes'
import { ClassDescontosGerais } from './resources/ClassDescontosGerais'
import { ClassPlanos } from './resources/ClassPlanos'
import { ClassAssinaturas } from './resources/ClassAssinaturas'

export class ClassDefinitions {
  static get queryFilterParceiros(): TDefinitionsForQueryFilter {
    return {
      filters: ClassParceiros.filters,
      defaultFilter: ClassParceiros.defaultFilterConfig,
    }
  }

  static get queryFilterProdutos(): TDefinitionsForQueryFilter {
    return {
      filters: ClassProdutos.filters,
      defaultFilter: ClassProdutos.defaultFilterConfig,
    }
  }

  static get queryFilterBeneficios(): TDefinitionsForQueryFilter {
    return {
      filters: ClassBeneficios.filters,
      defaultFilter: ClassBeneficios.defaultFilterConfig,
    }
  }

  static get queryFilterPromocoes(): TDefinitionsForQueryFilter {
    return {
      filters: ClassPromocoes.filters,
      defaultFilter: ClassPromocoes.defaultFilterConfig,
    }
  }

  static get queryFilterDescontos(): TDefinitionsForQueryFilter {
    return {
      filters: ClassDescontosGerais.filters,
      defaultFilter: ClassDescontosGerais.defaultFilterConfig,
    }
  }

  static get queryFilterPlanos(): TDefinitionsForQueryFilter {
    return {
      filters: ClassPlanos.filters,
      defaultFilter: ClassPlanos.defaultFilterConfig,
    }
  }

  static get queryFilterAssinaturas(): TDefinitionsForQueryFilter {
    return {
      filters: ClassAssinaturas.filters,
      defaultFilter: ClassAssinaturas.defaultFilterConfig,
    }
  }

  static get queryFilterUsers(): TDefinitionsForQueryFilter {
    return {
      filters: ClassUsuarios.filters,
      defaultFilter: ClassUsuarios.defaultFilterConfig,
    }
  }
}
