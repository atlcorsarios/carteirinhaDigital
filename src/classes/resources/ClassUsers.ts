import type { IHeadersDataTable, TEntityConfig } from '../models/modelComponents/ModelHeaderTable'
import type { IFilterColumn } from '../models/ModelFilterColumns'
import type { IUser } from '@/classes/models/resources/ModelUser'
import type { IQueryFilter } from '../models/modelComponents/ModelQueryFilter'
import { BaseClass } from '../subscriptions/BaseClass'
import { ClassFormatters } from '../ClassFormatters'

export class ClassUsers extends BaseClass<IUser> {
  constructor(data?: Partial<IUser>) {
    super(data)
  }

  static defaultUser(): IUser {
    return {
      id: 0,
      email: '@gmail.com',
      username: '',
      avatar_url: '',
      celular_contato: '',
      documento: '',
      cargo: 'aluno',
      usuario_ativo: true,
    }
  }

  protected getDefault(data: Partial<IUser> = {}): IUser {
    return this.createWithDefaults(data, ClassUsers.defaultUser())
  }

  static get fieldConfig(): TEntityConfig<IUser> {
    return {
      id: {
        minWidth: 50,
        width: 50,
        maxWidth: 100,
        excludeFromFilter: true,
        excludeFromChart: true,
      },
      email: {
        minWidth: 100,
        width: 100,
        maxWidth: 300,
        excludeFromChart: true,
      },
      username: {
        minWidth: 100,
        width: 100,
        maxWidth: 250,
        excludeFromChart: true,
      },
      avatar_url: {
        hidden: true,
      },
      celular_contato: {
        align: 'end',
        minWidth: 100,
        width: 100,
        maxWidth: 200,
        excludeFromChart: true,
      },
      documento: {
        minWidth: 100,
        width: 100,
        maxWidth: 300,
        excludeFromChart: true,
      },
      cargo: {
        chartFormatter: ClassFormatters.formatRolesTranslate,
        value: (user: IUser) => ClassFormatters.formatRolesTranslate(user.cargo),
        minWidth: 100,
        width: 100,
        maxWidth: 100,
        filterType: 'select',
        selectOptions: [
          { title: 'student', value: 'aluno' },
          { title: 'teacher', value: 'professor' },
          { title: 'partner', value: 'parceiro' },
          { title: 'director', value: 'diretoria' },
          { title: 'associate', value: 'associado' },
        ],
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
    const defaultModel = new ClassUsers().getDefault()
    return BaseClass.generateHeadersFromModel(
      defaultModel,
      'forms.formUser',
      ClassUsers.fieldConfig,
    )
  }

  static get filters(): IFilterColumn[] {
    const defaultModel = new ClassUsers().getDefault()
    return BaseClass.generateFiltersFromModel(
      defaultModel,
      'forms.formUser',
      ClassUsers.fieldConfig,
    )
  }

  static get defaultFilterConfig(): Partial<IQueryFilter> {
    return {
      field: 'username',
      condition: 'contains',
    }
  }
}
