import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'
import { BaseClass } from '../subscriptions/BaseClass'
import { ClassFormatters } from '../ClassFormatters'
import type { TParceiro } from '../models/resources/ModelUsuarios'

export class ClassParceiros extends BaseClass<TParceiro> {
  constructor(data?: Partial<TParceiro>) {
    super(data)
  }

  static defaultParceiro(): TParceiro {
    return {
      id_usuario: 0,
      email: '',
      username: '',
      avatar_url: '',
      celular_contato: '',
      documento: '',
      cargo: 'parceiro',
      usuario_ativo: true,
      created_at: '',
      data_renovacao: '',
      nome_fantasia: '',
      ativo: true
    }
  }

  protected getDefault(data: Partial<TParceiro> = {}): TParceiro {
    return this.createWithDefaults(data, ClassParceiros.defaultParceiro())
  }

  static get fieldConfig(): TEntityConfig<TParceiro> {
    return {
      id_usuario: {
        hidden: true
      },
      email: {
        minWidth: 100,
        width: 100,
        maxWidth: 300,
        excludeFromChart: true
      },
      username: {
        minWidth: 100,
        width: 100,
        maxWidth: 250,
        excludeFromChart: true
      },
      avatar_url: {
        hidden: true
      },
      celular_contato: {
        align: 'end',
        minWidth: 100,
        width: 100,
        maxWidth: 200,
        excludeFromChart: true
      },
      documento: {
        minWidth: 100,
        width: 100,
        maxWidth: 300,
        excludeFromChart: true
      },
      cargo: {
        hidden: true,
        excludeFromFilter: true
      },
      usuario_ativo: {
        excludeFromHeader: true,
        excludeFromChart: true
      },
      created_at: {
        minWidth: 150,
        width: 100,
        maxWidth: 300,
        chartFormatter: ClassFormatters.formatDate,
        value: (parceiro: TParceiro) => ClassFormatters.formatDate(parceiro.created_at),
        excludeFromChart: true
      },
      data_renovacao: {
        hidden: true
      },
      nome_fantasia: {
        minWidth: 300,
        width: 300,
        maxWidth: 500,
        excludeFromChart: true,
      },
      ativo: {
        align: 'center',
        width: 350,
        maxWidth: 350,
        minWidth: 50,
        chartFormatter: ClassFormatters.formatBoolean,
        value: (parceiro: TParceiro) => ClassFormatters.formatBoolean(parceiro.ativo),
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassParceiros().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formParceiro',
      ClassParceiros.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassParceiros().getDefault()
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formParceiro',
      ClassParceiros.fieldConfig,
    )
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'nome_fantasia',
      condition: 'contains',
    }
  }
}
