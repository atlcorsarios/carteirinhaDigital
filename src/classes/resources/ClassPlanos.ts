import { BaseClass } from "../subscriptions/BaseClass";
import type { IPlanos } from "../models/resources/ModelIPlanos";
import type { IHeadersDataTable, TEntityConfig } from "../models/modelComponents/ModelHeaderTable";
import { ClassFormatters } from "../ClassFormatters";
import type { IFilterColumn } from "../models/ModelFilterColumns";
import type { IQueryFilter } from "../models/modelComponents/ModelQueryFilter";

export class ClassPlanos extends BaseClass<IPlanos> {
  constructor(data?: Partial<IPlanos>) {
    super(data)
  }

  static defaultPlano(): IPlanos {
    return {
      id: '',
      nome: '',
      descricao: '',
      preco: 0.0,
      dias_validade: 0.0,
      ativo: true,
      created_at: ''
    }
  }

  protected getDefault(data: unknown = {}): IPlanos {
    const item = data as Partial<IPlanos>
    return this.createWithDefaults(item, ClassPlanos.defaultPlano())
  }

  static get fieldConfig(): TEntityConfig<IPlanos> {
    return {
      id: {
        hidden: true
      },
      nome: {
        align: 'center',
        width: 400,
        maxWidth: 600,
        minWidth: 200,
        excludeFromChart: true,
      },
      descricao: {
        width: 500,
        maxWidth: 600,
        minWidth: 300,
      },
      preco: {
        align: 'end',
        width: 350,
        maxWidth: 450,
        minWidth: 100,
        chartFormatter: ClassFormatters.formatPriceDynamic,
        value: (plano: IPlanos) => ClassFormatters.formatPriceDynamic(plano.preco),
      },
      dias_validade: {
        align: 'center',
        width: 100,
        maxWidth: 150,
        minWidth: 100,
      },
      ativo: {
        align: 'center',
        width: 350,
        maxWidth: 350,
        minWidth: 50,
        chartFormatter: ClassFormatters.formatBoolean,
        value: (plano: IPlanos) => ClassFormatters.formatBoolean(plano.ativo),
      },
      created_at: {
        hidden: true
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassPlanos().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formPlanos',
      ClassPlanos.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassPlanos().getDefault()
    const autoFilters = BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formPlanos',
      ClassPlanos.fieldConfig,
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
