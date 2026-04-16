import type { IRenovacoes } from "@/classes/models/resources/ModelRenovacoes"
import { supabase } from "../supabase"
import { useAuthStore } from "@/stores/authStore"

export class RenovacoesService {
  static async criarRenovacao(request: Partial<IRenovacoes>) {
    const authStore = useAuthStore();

    const payload: IRenovacoes = {
      id_usuario: request.id_usuario ?? String(authStore.userProfile?.id),
      nsu_transacao: request.nsu_transacao ?? '',
      nsu_pedido: request.nsu_pedido ?? '',
      url_comprovante: request.url_comprovante ?? '',
      valor: request.valor ?? 0,
      status_transacao: request.status_transacao ?? 'aprovada',
      data_processamento: request.data_processamento ?? Date.now().toString(),
    }

    try {
      const { data, error } = await supabase
        .from('renovacoes')
        .insert([
          {
            id_usuario: payload.id_usuario,
            nsu_transacao: payload.nsu_transacao,
            nsu_pedido: payload.nsu_pedido,
            url_comprovante: payload.url_comprovante || null,
            valor: payload.valor,
            status_transacao: payload.status_transacao
          }
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  }

  static async getHistoricoPorUsuario(idUsuario: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('renovacoes')
      .select('*')
      .eq('id_usuario', idUsuario)
      .order('data_processamento', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
