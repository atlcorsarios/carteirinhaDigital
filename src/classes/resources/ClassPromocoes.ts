import { BaseClass } from '../subscriptions/BaseClass'
import type { IPromocoes } from '../models/resources/ModelIPromocoes'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import { ClassFormatters } from '../ClassFormatters'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'

export class ClassPromocoes extends BaseClass<IPromocoes> {
  constructor(data?: Partial<IPromocoes>) {
    super(data)
  }

  static defaultPromocao(): IPromocoes {
    return {
      id: '',
      descricao_promocao: '',
      data_encerramento: '',
      desconto_aplicavel: 0.0,
      somente_associados: false,
      ativo: true
    }
  }

  protected getDefault(data: unknown = {}): IPromocoes {
    const item = data as Partial<IPromocoes>
    return this.createWithDefaults(item, ClassPromocoes.defaultPromocao())
  }

  static get fieldConfig(): TEntityConfig<IPromocoes> {
    return {
      id: {
        hidden: true
      },
      descricao_promocao: {
        align: 'center',
        width: 700,
        maxWidth: 850,
        minWidth: 250,
        excludeFromChart: true,
      },
      data_encerramento: {
        align: 'center',
        width: 350,
        maxWidth: 450,
        minWidth: 100,
        chartFormatter: ClassFormatters.formatDate,
        value: (promocao: IPromocoes) => ClassFormatters.formatDate(promocao.data_encerramento),
      },
      desconto_aplicavel: {
        width: 200,
        maxWidth: 250,
        minWidth: 100,
      },
      somente_associados: {
        align: 'center',
        width: 200,
        maxWidth: 250,
        minWidth: 100,
        chartFormatter: ClassFormatters.formatBoolean,
        value: (promocao: IPromocoes) => ClassFormatters.formatBoolean(promocao.somente_associados),
      },
      ativo: {
        align: 'center',
        width: 200,
        maxWidth: 250,
        minWidth: 50,
        chartFormatter: ClassFormatters.formatBoolean,
        value: (promocao: IPromocoes) => ClassFormatters.formatBoolean(promocao.ativo),
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassPromocoes().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formPromocoes',
      ClassPromocoes.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassPromocoes().getDefault()
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formPromocoes',
      ClassPromocoes.fieldConfig,
    )
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'descricao_promocao',
      condition: 'contains',
    }
  }
}
