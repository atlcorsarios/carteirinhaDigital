import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IUser } from '@/classes/models/resources/ModelUsuarios'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'
import { BaseClass } from '../subscriptions/BaseClass'
import { ClassFormatters } from '../ClassFormatters'

export class ClassUsuarios extends BaseClass<IUser> {
  constructor(data?: Partial<IUser>) {
    super(data)
  }

  static defaultUser(): IUser {
    return {
      id: '',
      email: '@gmail.com',
      username: '',
      avatar_url: '',
      celular_contato: '',
      documento: '',
      cargo: 'aluno',
      created_at: '',
      usuario_ativo: true
    }
  }

  protected getDefault(data: Partial<IUser> = {}): IUser {
    return this.createWithDefaults(data, ClassUsuarios.defaultUser())
  }

  static get fieldConfig(): TEntityConfig<IUser> {
    return {
      id: {
        hidden: true
      },
      email: {
        width: 350,
        maxWidth: 450,
        minWidth: 300,
        excludeFromChart: true,
      },
      username: {
        width: 250,
        maxWidth: 300,
        minWidth: 200,
        excludeFromChart: true,
      },
      avatar_url: {
        hidden: true,
      },
      celular_contato: {
        align: 'end',
        width: 150,
        maxWidth: 200,
        minWidth: 100,
        excludeFromChart: true,
      },
      documento: {
        width: 150,
        maxWidth: 300,
        minWidth: 100,
        excludeFromChart: true,
      },
      cargo: {
        align: 'center',
        width: 350,
        maxWidth: 400,
        minWidth: 300,
        filterType: 'select',
        selectOptions: ClassFormatters.formatOptionsRoles(),
        chartFormatter: ClassFormatters.formatRolesTranslate,
        value: (user: IUser) => ClassFormatters.formatRolesTranslate(user.cargo)
      },
      created_at: {
        width: 250,
        maxWidth: 300,
        minWidth: 200,
        chartFormatter: ClassFormatters.formatDate,
        value: (user: IUser) => ClassFormatters.formatDate(user.created_at),
        excludeFromChart: true,
      },
      usuario_ativo: {
        align: 'center',
        chartFormatter: ClassFormatters.formatBoolean,
        value: (user: IUser) => ClassFormatters.formatBoolean(user.usuario_ativo),
        width: 50,
      },
    }
  }

  static get headers(): IHeadersDataTable[] {
    const defaultModel = new ClassUsuarios().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formUser',
      ClassUsuarios.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassUsuarios().getDefault()
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formUser',
      ClassUsuarios.fieldConfig,
    )
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'username',
      condition: 'contains',
    }
  }
}
