import { ClassProdutos } from '@/classes/resources/ClassProdutos'
import type { IProdutos } from '@/classes/models/resources/ModelIProdutos'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import { supabase } from '../supabase'

export class ProductsService {
  static async paginationsProducts(payload: TPayloadRequestPagination): Promise<IProdutos[]> {
    try {
      let query = supabase
        .from('vw_produtos_vitrine')
        .select(`
          *,
          parceiros (
            nome_fantasia,
            data_renovacao,
            ativo,
            usuarios (
              username,
              avatar_url,
              celular_contato
            )
          )
        `)

      query = applySupabaseFilters(query, payload.filters, ClassProdutos.filters)

      if (payload.cursor) {
        query = query.gt('id', payload.cursor)
      }
      if (payload.limit) {
        query = query.limit(payload.limit)
      }

      query = query.order('id', { ascending: true })
      const { data, error } = await query

      if (error) throw error
      return data as IProdutos[];

    } catch (error) {
      console.error('Erro na paginação de produtos:', error);
      throw error
    }
  }

  static async saveProduct() { }
}
