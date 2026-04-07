import { supabase } from '@/services/supabase'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { ClassParceiros } from '@/classes/resources/ClassParceiros'

export class ParceirosService {
  static async paginationsParceiros(payload: TPayloadRequestPagination): Promise<any[]> {
    try {
      let query = supabase
        .from('usuarios')
        .select('*, parceiros!inner(*), enderecos(cidade, estado)')

      query = applySupabaseFilters(query, payload.filters, ClassParceiros.filters);

      if (payload.cursor) query = query.gt('id', payload.cursor)
      if (payload.limit) query = query.limit(payload.limit)
      query = query.order('id', { ascending: true })

      const { data, error } = await query
      if (error) throw error

      return data.map((user: any) => {
        const infoParceiro = user.parceiros;

        return {
          ...user,
          nome_fantasia: infoParceiro?.nome_fantasia || 'Sem Nome',
          ativo: infoParceiro?.ativo ?? false,
          data_renovacao: infoParceiro?.data_renovacao,
          id_parceiro: infoParceiro?.id_usuario
        }
      })

    } catch (error) {
      console.error('Erro na paginação de Parceiros:', error)
      throw error
    }
  }
}
