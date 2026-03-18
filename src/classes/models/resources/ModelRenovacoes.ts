export interface IRenovacoes {
  id?: string,
  id_usuario: string,
  nsu_transacao: string,
  nsu_pedido: string,
  url_comprovante: string,
  valor: number | string,
  status_transacao: string,
  data_processamento: Date | string
}
