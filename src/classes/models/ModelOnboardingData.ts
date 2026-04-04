import type { IUser } from "./resources/ModelUsuarios";

export interface IOnboardingData extends Pick<IUser, 'avatar_url' | 'celular_contato' | 'documento' | 'cargo'> {
  codigo_otp?: string
  nome_fantasia?: string
  data_renovacao?: Date | string
}
