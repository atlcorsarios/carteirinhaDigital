import type { IBeneficiosDetalhados } from "./ModelIBeneficios"

export interface IPlanos {
  id?: string
  nome: string
  descricao: string
  preco: number
  dias_validade: number
  ativo: boolean
  created_at?: Date | string
}

export interface IPlanoBeneficioPivot {
  beneficios: IBeneficiosDetalhados
}

export interface IPlanosDetalhados extends IPlanos {
  plano_beneficios?: IPlanoBeneficioPivot[]
}
