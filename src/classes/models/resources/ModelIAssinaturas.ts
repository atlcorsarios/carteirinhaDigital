import type { IPlanos } from "./ModelIPlanos";
import type { IUser } from "./ModelUsuarios";

export interface IAssinaturas {
  id?: string;
  usuario_id: string;
  plano_id: string;
  data_inicio: string | Date;
  data_vencimento: string | Date;
  status: 'ativa' | 'vencida' | 'cancelada';
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface IAssinaturasDetalhadas extends IAssinaturas {
  usuarios?: Pick<IUser, 'username' | 'documento' | 'avatar_url' | 'email'>;
  planos?: Pick<IPlanos, 'nome' | 'preco'>;
}
