export const validRoles = ['ADMIN', 'USER'] as const
export type TRole = (typeof validRoles)[number]

export const ROLE_TRANSLATIONS: Record<TRole, string> = {
  ADMIN: 'forms.formUser.role.types.admin',
  USER: 'forms.formUser.role.types.user',
}

export interface IUser {
  idUser?: number
  username: string
  email: string
  image: string
  role: TRole
  phoneNumber?: string
  receiveNotifications: boolean
  active: boolean
}
