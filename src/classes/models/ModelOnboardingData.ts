import type { IUser } from "./resources/ModelUsuarios";

export interface IOnboardingData extends Pick<IUser, 'avatar_url' | 'celular_contato' | 'documento' | 'cargo'> {
  codigo_otp?: string
}
