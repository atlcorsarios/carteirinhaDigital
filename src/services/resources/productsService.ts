import { ClassProducts } from '@/classes/resources/ClassProducts'
import type { IProduct } from '@/classes/models/resources/ModelIProduct'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import { supabase } from '../supabase'

export class ProductsService {
  static async paginationsProducts(payload: TPayloadRequestPagination): Promise<IProduct[]> {
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

      query = applySupabaseFilters(query, payload.filters, ClassProducts.filters)

      if (payload.cursor) {
        query = query.gt('id', payload.cursor)
      }
      if (payload.limit) {
        query = query.limit(payload.limit)
      }

      query = query.order('id', { ascending: true })
      const { data, error } = await query

      if (error) throw error
      return data as IProduct[];

    } catch (error) {
      console.error('Erro na paginação de produtos:', error);
      throw error
    }
  }

  static async createProduct() {}
}
