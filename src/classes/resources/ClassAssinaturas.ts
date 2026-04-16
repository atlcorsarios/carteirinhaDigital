import { BaseClass } from '../subscriptions/BaseClass'
import type { IAssinaturasDetalhadas } from '../models/resources/ModelIAssinaturas'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import { ClassFormatters } from '../ClassFormatters'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'

export class ClassAssinaturas extends BaseClass<IAssinaturasDetalhadas> {
  constructor(data?: Partial<IAssinaturasDetalhadas>) {
    super(data)
  }

  static defaultAssinatura(): IAssinaturasDetalhadas {
    return {
      id: '',
      usuario_id: '',
      plano_id: '',
      data_inicio: new Date().toISOString(),
      data_vencimento: new Date().toISOString(),
      status: 'ativa'
    }
  }

  protected getDefault(data: unknown = {}): IAssinaturasDetalhadas {
    const item = data as Partial<IAssinaturasDetalhadas>
    return this.createWithDefaults(item, ClassAssinaturas.defaultAssinatura())
  }

  static get fieldConfig(): TEntityConfig<IAssinaturasDetalhadas> {
    return {
      id: {
        hidden: true
      },
      usuario_id: {
        hidden: true
      },
      usuarios: {
        hidden: true
      },
      plano_id: {
        hidden: true
      },
      planos: {
        hidden: true
      },
      data_inicio: {
        align: 'center',
        width: 700,
        maxWidth: 850,
        minWidth: 250,
        chartFormatter: ClassFormatters.formatDate,
        value: (assinatura: IAssinaturasDetalhadas) => ClassFormatters.formatDate(assinatura.data_inicio),
        excludeFromChart: true,
      },
      data_vencimento: {
        align: 'center',
        width: 700,
        maxWidth: 850,
        minWidth: 250,
        chartFormatter: ClassFormatters.formatDate,
        value: (assinatura: IAssinaturasDetalhadas) => ClassFormatters.formatDate(assinatura.data_vencimento),
        excludeFromChart: true,
      },
      status: {
        align: 'center',
        width: 300,
        maxWidth: 450,
        minWidth: 250,
        cellClass: (assinatura: IAssinaturasDetalhadas) => {
          return assinatura.status === 'ativa' ?
            'text-success font-weight-bold' :
            assinatura.status === 'vencida' ?
            'text-error' : 'text-warning'
          }
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassAssinaturas().getDefault()
    const headers = [
      {
        key: 'usuarios.username',
        title: 'forms.formUser.username',
        width: 200,
        maxWidth: 350,
        minWidth: 150,
      },
      {
        key: 'planos.nome',
        title: 'forms.formPlanos.nome',
        width: 200,
        maxWidth: 350,
        minWidth: 150,
      }
    ];

    const autoHeaders = BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formAssinatura',
      ClassAssinaturas.fieldConfig
    )

    return [ ...headers, ...autoHeaders ];
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassAssinaturas().getDefault()
    const filters = BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formAssinaturas',
      ClassAssinaturas.fieldConfig,
    );

    filters.push({
      key: 'planos.nome',
      label: 'forms.formPlanos.nome',
      type: 'text',
    });

    filters.push({
      key: 'usuarios.username',
      label: 'forms.formUser.username',
      type: 'text',
    });

    return filters
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'usuarios.username',
      condition: 'contains',
    }
  }
}
