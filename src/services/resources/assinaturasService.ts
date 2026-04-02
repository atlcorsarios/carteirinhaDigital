import { supabase } from '../supabase'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import { ClassAssinaturas } from '@/classes/resources/ClassAssinaturas'
import type { IAssinaturasDetalhadas } from '@/classes/models/resources/ModelIAssinaturas'

export class AssinaturasService {
  static async buscarAssinaturaPorUsuarioId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('usuario_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error)
      throw error
    }
  }

  static async paginationsAssinaturas(payload: TPayloadRequestPagination): Promise<IAssinaturasDetalhadas[]> {
    try {
      let query = supabase
        .from('assinaturas')
        .select('*, usuarios!inner(username, documento, avatar_url, email), planos!inner(nome, preco)')

      query = applySupabaseFilters(query, payload.filters, ClassAssinaturas.filters)

      if (payload.cursor) query = query.gt('id', payload.cursor)
      if (payload.limit) query = query.limit(payload.limit)

      query = query.order('data_vencimento', { ascending: false })
      const { data, error } = await query

      if (error) throw error
      return (data as unknown) as IAssinaturasDetalhadas[];
    } catch (error) {
      console.error('Erro na paginação de assinaturas:', error);
      throw error
    }
  }

  static async saveAssinatura(assinatura: Partial<IAssinaturasDetalhadas>): Promise<IAssinaturasDetalhadas> {
    const { id, usuarios, planos, ...dbPayload } = assinatura;

    const isUpdate = id && id.length > 10;
    const { data, error } = isUpdate
      ? await supabase.from('assinaturas').update(dbPayload).eq('id', id).select('*, usuarios(*), planos(*)').single()
      : await supabase.from('assinaturas').insert(dbPayload).select('*, usuarios(*), planos(*)').single();

    if (error) throw error;
    return (data as unknown) as IAssinaturasDetalhadas;
  }
}
