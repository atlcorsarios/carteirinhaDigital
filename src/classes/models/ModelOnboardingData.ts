import type { IUser } from "./resources/ModelUser";

export interface IOnboardingData extends Pick<IUser, 'avatar_url' | 'celular_contato' | 'documento' | 'cargo'> {
  codigo_otp?: string
}
