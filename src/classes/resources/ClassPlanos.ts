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
      created_at: '',
      ativo: true
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
        width: 350,
        maxWidth: 400,
        minWidth: 200,
        excludeFromChart: true,
      },
      descricao: {
        align: 'center',
        width: 500,
        maxWidth: 550,
        minWidth: 300,
        excludeFromChart: true
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
      created_at: {
        align: 'center',
        width: 100,
        maxWidth: 150,
        minWidth: 100,
        chartFormatter: ClassFormatters.formatDate,
        value: (plano: IPlanos) => ClassFormatters.formatDate(plano.created_at),
        excludeFromChart: true,
      },
      ativo: {
        align: 'center',
        width: 350,
        maxWidth: 350,
        minWidth: 50,
        chartFormatter: ClassFormatters.formatBoolean,
        value: (plano: IPlanos) => ClassFormatters.formatBoolean(plano.ativo),
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
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formPlanos',
      ClassPlanos.fieldConfig,
    )
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'descricao',
      condition: 'contains',
    }
  }
}
