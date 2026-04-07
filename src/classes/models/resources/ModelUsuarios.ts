export const validRoles = ['aluno', 'professor', 'parceiro', 'diretoria', 'associado'] as const
export type TRole = (typeof validRoles)[number]

export const ROLE_TRANSLATIONS: Record<TRole, string> = {
  aluno: 'forms.formUser.cargo.types.student',
  professor: 'forms.formUser.cargo.types.teacher',
  parceiro: 'forms.formUser.cargo.types.partner',
  diretoria: 'forms.formUser.cargo.types.director',
  associado: 'forms.formUser.cargo.types.associate'
}

export interface IUser {
  id?: string
  email: string
  username: string
  avatar_url: string
  celular_contato?: string
  documento: string
  cargo: TRole
  usuario_ativo: boolean
  created_at?: Date | string
}

export type TParceiro = Omit<IUser, 'id'> & {
  id_usuario: string
  data_renovacao: Date | string
  nome_fantasia: string
  ativo: boolean
}
