import { BaseClass } from '../subscriptions/BaseClass'
import type { IProduct } from '../models/resources/ModelIProduct'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import { ClassFormatters } from '../ClassFormatters'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'

export class ClassProducts extends BaseClass<IProduct> {
  constructor(data?: Partial<IProduct>) {
    super(data)
  }

  static defaultProduct(): IProduct {
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
      parceiros: null
    }
  }

  protected getDefault(data: unknown = {}): IProduct {
    const item = data as Partial<IProduct>
    return this.createWithDefaults(item, ClassProducts.defaultProduct())
  }

  static get fieldConfig(): TEntityConfig<IProduct> {
    return {
      id: {
        width: 50,
        maxWidth: 100,
        minWidth: 30,
        excludeFromFilter: true,
        excludeFromChart: true,
      },
      id_parceiro: {
        width: 50,
        maxWidth: 100,
        minWidth: 30,
        excludeFromFilter: true,
        excludeFromChart: true,
      },
      nome: {
        align: 'center',
        width: 700,
        maxWidth: 850,
        minWidth: 250,
        excludeFromChart: true,
      },
      descricao_produto: {
        align: 'center',
        width: 700,
        maxWidth: 850,
        minWidth: 250,
        excludeFromChart: true,
      },
      especificacoes_produto: {
        align: 'center',
        width: 700,
        maxWidth: 850,
        minWidth: 250,
        excludeFromChart: true,
      },
      valor_produto: {
        align: 'end',
        width: 350,
        maxWidth: 450,
        minWidth: 100,
        chartFormatter: ClassFormatters.formatPriceDynamic,
        value: (produto: IProduct) => ClassFormatters.formatPriceDynamic(produto.valor_produto),
      },
      avatar_url_produto: {
        hidden: true
      },
      estoque: {
        align: 'center',
        width: 350,
        maxWidth: 450,
        minWidth: 100,
      },
      ativo: {
        align: 'center',
        width: 350,
        maxWidth: 350,
        minWidth: 50,
        chartFormatter: ClassFormatters.formatBoolean,
        value: (produto: IProduct) => ClassFormatters.formatBoolean(produto.ativo),
      },
      parceiros: {
        hidden: true
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassProducts().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formProduct',
      ClassProducts.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassProducts().getDefault()
    const autoFilters = BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formProduct',
      ClassProducts.fieldConfig,
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
