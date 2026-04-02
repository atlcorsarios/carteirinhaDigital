import { BaseClass } from '../subscriptions/BaseClass'
import type { IBeneficios } from '../models/resources/ModelIBeneficios'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import { ClassFormatters } from '../ClassFormatters'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'

export class ClassBeneficios extends BaseClass<IBeneficios> {
  constructor(data?: Partial<IBeneficios>) {
    super(data)
  }

  static defaultBeneficio(): IBeneficios {
    return {
      id: '',
      id_parceiro: '',
      descricao_beneficio: '',
      desconto_aplicavel: 0.0,
      restricao_beneficio: '',
      ativo: true
    }
  }

  protected getDefault(data: unknown = {}): IBeneficios {
    const item = data as Partial<IBeneficios>
    return this.createWithDefaults(item, ClassBeneficios.defaultBeneficio())
  }

  static get fieldConfig(): TEntityConfig<IBeneficios> {
    return {
      id: {
        hidden: true
      },
      id_parceiro: {
        hidden: true
      },
      descricao_beneficio: {
        align: 'center',
        width: 700,
        maxWidth: 850,
        minWidth: 250,
        excludeFromChart: true,
      },
      desconto_aplicavel: {
        width: 700,
        maxWidth: 850,
        minWidth: 250,
      },
      restricao_beneficio: {
        hidden: true
      },
      ativo: {
        align: 'center',
        width: 350,
        maxWidth: 350,
        minWidth: 50,
        chartFormatter: ClassFormatters.formatBoolean,
        value: (beneficio: IBeneficios) => ClassFormatters.formatBoolean(beneficio.ativo),
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassBeneficios().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formBeneficio',
      ClassBeneficios.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassBeneficios().getDefault()
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formBeneficio',
      ClassBeneficios.fieldConfig,
    )
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'descricao_beneficio',
      condition: 'contains',
    }
  }
}
