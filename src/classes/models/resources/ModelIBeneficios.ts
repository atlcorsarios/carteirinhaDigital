import type { TParceiro } from './ModelUsuarios'

export interface IBeneficios {
  id?: string
  id_parceiro: string
  descricao_beneficio: string
  desconto_aplicavel: number
  restricao_beneficio: string
  ativo: boolean
}

export interface IBeneficiosDetalhados extends IBeneficios {
  parceiro?: TParceiro
}
