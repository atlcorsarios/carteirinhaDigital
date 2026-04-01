import { BaseClass } from '../subscriptions/BaseClass'
import type { IDescontosGerais } from '../models/resources/ModelIDescontosGerais'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import { ClassFormatters } from '../ClassFormatters'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'

export class ClassDescontosGerais extends BaseClass<IDescontosGerais> {
  constructor(data?: Partial<IDescontosGerais>) {
    super(data)
  }

  static defaultDesconto(): IDescontosGerais {
    return {
      id: '',
      descricao: '',
      cargos_beneficiados: [],
      desconto_aplicavel: 0.0,
      ativo: true
    }
  }

  protected getDefault(data: unknown = {}): IDescontosGerais {
    const item = data as Partial<IDescontosGerais>
    return this.createWithDefaults(item, ClassDescontosGerais.defaultDesconto())
  }

  static get fieldConfig(): TEntityConfig<IDescontosGerais> {
    return {
      id: {
        hidden: true
      },
      descricao: {
        align: 'center',
        width: 700,
        maxWidth: 850,
        minWidth: 250,
        excludeFromChart: true,
      },
      cargos_beneficiados: {
        hidden: true
      },
      desconto_aplicavel: {
        hidden: true
      },
      ativo: {
        align: 'center',
        width: 350,
        maxWidth: 350,
        minWidth: 50,
        chartFormatter: ClassFormatters.formatBoolean,
        value: (produto: IDescontosGerais) => ClassFormatters.formatBoolean(produto.ativo),
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassDescontosGerais().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formDesconto',
      ClassDescontosGerais.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassDescontosGerais().getDefault()
    const autoFilters = BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formDesconto',
      ClassDescontosGerais.fieldConfig,
    )

    return autoFilters
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'descricao',
      condition: 'contains',
    }
  }
}
