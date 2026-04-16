import type { TRole, IUser } from './ModelUsuarios'
import type { IPlanos } from './ModelIPlanos'

export interface IOTPCode {
  id?: string
  codigo: string
  usuario_destino_id: string
  gerado_por: string
  plano_id: string
  cargo_destino: TRole
  data_expiracao: Date | string
  usado: boolean
  data_uso?: Date | string | null
  created_at?: Date | string
}

export interface IOTPCodeDetalhado extends IOTPCode {
  plano: IPlanos
  usuario_destino: IUser
  usuario_gerador: IUser
}
