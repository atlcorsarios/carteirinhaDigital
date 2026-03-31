import type { IPromocaoProdutoPivot } from "./ModelIPromocoes"
import type { TParceiro } from "./ModelUser"

export interface IProdutos {
  id?: string
  id_parceiro: string
  nome: string
  descricao_produto: string
  especificacoes_produto: string
  valor_produto: number
  avatar_url_produto: string
  estoque: number
  ativo: boolean
}

export interface IProdutosDetalhados extends IProdutos {
  parceiro?: TParceiro
  promocao?: IPromocaoProdutoPivot[]
}
