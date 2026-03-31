export interface IPromocoes {
  id: string
  descricao_promocao: string
  data_encerramento: Date | string
  desconto_aplicavel: number // Percentual (0% a 100%)
  somente_associados: boolean
  ativo: boolean
}

export interface IPromocaoProdutoPivot {
  promocoes: IPromocoes
}
