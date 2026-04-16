import { BaseClass } from '../subscriptions/BaseClass'
import type { IOTPCodeDetalhado } from '../models/resources/ModelIOTP'
import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import { ClassFormatters } from '../ClassFormatters'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'
import { ClassPlanos } from './ClassPlanos'
import { ClassUsuarios } from './ClassUsuarios'

export class ClassOTP extends BaseClass<IOTPCodeDetalhado> {
  constructor(data?: Partial<IOTPCodeDetalhado>) {
    super(data)
  }

  static defaultOTP(): IOTPCodeDetalhado {
    const now = new Date();
    const data_expiracao_default = new Date(now);
    data_expiracao_default.setMinutes(now.getMinutes() + 20);

    return {
      id: '',
      codigo: '',
      usuario_destino_id: '',
      gerado_por: '',
      plano_id: '',
      cargo_destino: 'associado',
      data_expiracao: data_expiracao_default,
      usado: false,
      data_uso: undefined,
      created_at: new Date().toISOString(),
      plano: ClassPlanos.defaultPlano(),
      usuario_destino: ClassUsuarios.defaultUser(),
      usuario_gerador: ClassUsuarios.defaultUser()
    }
  }

  protected getDefault(data: unknown = {}): IOTPCodeDetalhado {
    const item = data as Partial<IOTPCodeDetalhado>
    return this.createWithDefaults(item, ClassOTP.defaultOTP())
  }

  static get fieldConfig(): TEntityConfig<IOTPCodeDetalhado> {
    return {
      id: {
        hidden: true
      },
      codigo: {
        align: 'center',
        width: 150,
        maxWidth: 200,
        minWidth: 100,
      },
      usuario_destino_id: {
        hidden: true
      },
      gerado_por: {
        hidden: true
      },
      plano_id: {
        hidden: true
      },
      cargo_destino: {
        align: 'center',
        width: 300,
        maxWidth: 350,
        minWidth: 250
      },
      data_expiracao: {
        align: 'center',
        width: 400,
        maxWidth: 450,
        minWidth: 350,
        chartFormatter: ClassFormatters.formatDateTime,
        value: (otp: IOTPCodeDetalhado) => ClassFormatters.formatDateTime(otp.data_expiracao),
        excludeFromChart: true,
      },
      usado: {
        align: 'center',
        width: 300,
        maxWidth: 450,
        minWidth: 250,
        cellClass: (otp: IOTPCodeDetalhado) => {
          return otp.usado ?
            'text-success font-weight-bold' :
            'text-warning'
          }
      },
      data_uso: {
        align: 'center',
        width: 400,
        maxWidth: 450,
        minWidth: 350,
        chartFormatter: ClassFormatters.formatDateTime,
        value: (otp: IOTPCodeDetalhado) => ClassFormatters.formatDateTime(otp.data_expiracao),
        excludeFromChart: true,
      },
      created_at: {
        hidden: true
      },
      plano: {
        hidden: true
      },
      usuario_destino: {
        hidden: true
      },
      usuario_gerador: {
        hidden: true
      }
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassOTP().getDefault()
    const headers = [
      {
        key: 'plano.nome',
        title: 'forms.formPlanos.nome',
        width: 200,
        maxWidth: 350,
        minWidth: 150,
      },
      {
        key: 'usuario_destino.email',
        title: 'forms.formOTP.usuario_destino',
        width: 200,
        maxWidth: 350,
        minWidth: 150,
      },
      {
        key: 'usuario_gerador.email',
        title: 'forms.formOTP.usuario_gerador',
        width: 200,
        maxWidth: 350,
        minWidth: 150,
      }
    ];

    const autoHeaders = BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formOTP',
      ClassOTP.fieldConfig
    )

    return [ ...headers, ...autoHeaders ];
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassOTP().getDefault()
    const filters = BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formOTP',
      ClassOTP.fieldConfig,
    );

    filters.push({
      key: 'planos.nome',
      label: 'forms.formPlanos.nome',
      type: 'text',
    });

    filters.push({
      key: 'usuario_destino.email',
      label: 'forms.formUser.email',
      type: 'text',
    });

    filters.push({
      key: 'usuario_gerador.email',
      label: 'forms.formUser.email',
      type: 'text',
    });

    return filters
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'plano.nome',
      condition: 'contains',
    }
  }
}
