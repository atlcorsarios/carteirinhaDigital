import { ClassPromocoes } from '@/classes/resources/ClassPromocoes'
import type { IPromocoesDetalhadas } from '@/classes/models/resources/ModelIPromocoes'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { QUERY_SELECT_PROMOCOES_FULL_JOIN } from './queries/queriesPromocoes'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import { supabase } from '../supabase'

export class PromocoesService {
  static async fetchPromocao(idPromocao: string, fromTable: string = 'promocoes', withDetails: boolean = true): Promise<IPromocoesDetalhadas> {
    try {
      if (!idPromocao) throw new Error('IdPromocao undefined');
      const selectString = withDetails ? QUERY_SELECT_PROMOCOES_FULL_JOIN : '*';

      let query = supabase.from(fromTable).select(selectString as any).eq('id', idPromocao).single()
      const { data, error } = await query

      if (error) throw error
      return (data as unknown) as IPromocoesDetalhadas;
    } catch (error) {
      console.error('Erro na consulta de promocao:', error);
      throw error
    }
  }

  static async paginationsPromocoes(payload: TPayloadRequestPagination, fromTable: string = 'promocoes', withDetails: boolean = true): Promise<IPromocoesDetalhadas[]> {
    try {
      const selectString = withDetails ? QUERY_SELECT_PROMOCOES_FULL_JOIN : '*';
      let query = supabase.from(fromTable).select(selectString as any)

      query = applySupabaseFilters(query, payload.filters, ClassPromocoes.filters)

      if (payload.cursor) query = query.gt('id', payload.cursor)
      if (payload.limit) query = query.limit(payload.limit)

      query = query.order('id', { ascending: true })
      const { data, error } = await query

      if (error) throw error
      return (data as unknown) as IPromocoesDetalhadas[];
    } catch (error) {
      console.error('Erro na paginação de promocoes:', error);
      throw error
    }
  }

  static async savePromocao(promocao: Partial<IPromocoesDetalhadas>): Promise<IPromocoesDetalhadas> {
    try {
      const { id, promocao_produtos, ...rawPayload } = promocao
      const dbPayload: Record<string, any> = {}

      for (const [key, value] of Object.entries(rawPayload)) {
        if (key === 'produtos' || key === 'promocao_produtos') continue;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) continue;
        dbPayload[key] = value === '' ? null : value
      }

      const isUpdate = id && id.length > 10

      if (isUpdate) {
        const { data, error } = await supabase.from('promocoes').update(dbPayload).eq('id', id).select(QUERY_SELECT_PROMOCOES_FULL_JOIN as any).single()
        if (error) throw error
        return (data as unknown) as IPromocoesDetalhadas
      } else {
        const { data, error } = await supabase.from('promocoes').insert(dbPayload).select(QUERY_SELECT_PROMOCOES_FULL_JOIN as any).single()
        if (error) throw error
        return (data as unknown) as IPromocoesDetalhadas
      }
    } catch (error) {
      console.error('Erro ao salvar a promocao:', error)
      throw error
    }
  }

  static async inactivatePromocao(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('promocoes').update({ ativo: false }).eq('id', id)
      if (error) throw error
    } catch (error) {
      console.error('Erro ao inativar a promocao:', error)
      throw error
    }
  }
}
