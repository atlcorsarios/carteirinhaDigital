import { BaseClass } from '../subscriptions/BaseClass'
import type { IProdutos } from '../models/resources/ModelIProdutos'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import { ClassFormatters } from '../ClassFormatters'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'

export class ClassProdutos extends BaseClass<IProdutos> {
  constructor(data?: Partial<IProdutos>) {
    super(data)
  }

  static defaultProduct(): IProdutos {
    return {
      id: '',
      id_parceiro: '',
      nome: '',
      descricao_produto: '',
      especificacoes_produto: '',
      valor_produto: 0.0,
      avatar_url_produto: '',
      estoque: 0.0,
      ativo: true,
      parceiro: null
    }
  }

  protected getDefault(data: unknown = {}): IProdutos {
    const item = data as Partial<IProdutos>
    return this.createWithDefaults(item, ClassProdutos.defaultProduct())
  }

  static get fieldConfig(): TEntityConfig<IProdutos> {
    return {
      id: {
        hidden: true
      },
      id_parceiro: {
        hidden: true
      },
      nome: {
        align: 'center',
        width: 700,
        maxWidth: 850,
        minWidth: 250,
        excludeFromChart: true,
      },
      descricao_produto: {
        hidden: true
      },
      especificacoes_produto: {
        hidden: true
      },
      valor_produto: {
        align: 'end',
        width: 350,
        maxWidth: 450,
        minWidth: 100,
        chartFormatter: ClassFormatters.formatPriceDynamic,
        value: (produto: IProdutos) => ClassFormatters.formatPriceDynamic(produto.valor_produto),
      },
      avatar_url_produto: {
        hidden: true
      },
      estoque: {
        align: 'center',
        width: 350,
        maxWidth: 450,
        minWidth: 100,
        excludeFromChart: true,
        excludeFromFilter: true
      },
      ativo: {
        align: 'center',
        width: 350,
        maxWidth: 350,
        minWidth: 50,
        chartFormatter: ClassFormatters.formatBoolean,
        value: (produto: IProdutos) => ClassFormatters.formatBoolean(produto.ativo),
      },
      parceiro: {
        hidden: true
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassProdutos().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formProduct',
      ClassProdutos.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassProdutos().getDefault()
    const autoFilters = BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formProduct',
      ClassProdutos.fieldConfig,
    )

    return autoFilters
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'description',
      condition: 'contains',
    }
  }
}
