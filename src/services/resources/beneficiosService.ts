import { ClassBeneficios } from '@/classes/resources/ClassBeneficios'
import type { IBeneficiosDetalhados } from '@/classes/models/resources/ModelIBeneficios'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { QUERY_SELECT_BENEFICIOS_FULL_JOIN } from './queries/queriesBeneficios'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import { supabase } from '../supabase'

export class BeneficiosService {
  static async fetchBeneficio(idBeneficio: string, fromTable: string = 'beneficios', withDetails: boolean = true): Promise<IBeneficiosDetalhados> {
    try {
      if (!idBeneficio) throw new Error('IdBeneficio undefined');
      const selectString = withDetails ? QUERY_SELECT_BENEFICIOS_FULL_JOIN : '*';

      let query = supabase.from(fromTable).select(selectString as any).eq('id', idBeneficio).single()
      const { data, error } = await query

      if (error) throw error
      return (data as unknown) as IBeneficiosDetalhados;
    } catch (error) {
      console.error('Erro na consulta de beneficio:', error);
      throw error
    }
  }

  static async paginationsBeneficios(payload: TPayloadRequestPagination, fromTable: string = 'beneficios', withDetails: boolean = true): Promise<IBeneficiosDetalhados[]> {
    try {
      const selectString = withDetails ? QUERY_SELECT_BENEFICIOS_FULL_JOIN : '*';
      let query = supabase.from(fromTable).select(selectString as any)

      query = applySupabaseFilters(query, payload.filters, ClassBeneficios.filters)

      if (payload.cursor) query = query.gt('id', payload.cursor)
      if (payload.limit) query = query.limit(payload.limit)

      query = query.order('id', { ascending: true })
      const { data, error } = await query

      if (error) throw error
      return (data as unknown) as IBeneficiosDetalhados[];
    } catch (error) {
      console.error('Erro na paginação de beneficios:', error);
      throw error
    }
  }

  static async saveBeneficio(beneficio: Partial<IBeneficiosDetalhados>): Promise<IBeneficiosDetalhados> {
    try {
      const { id, parceiro, ...rawPayload } = beneficio
      const dbPayload: Record<string, any> = {}

      for (const [key, value] of Object.entries(rawPayload)) {
        if (key === 'parceiro' || key === 'parceiros') continue;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) continue;
        dbPayload[key] = value === '' ? null : value
      }

      const isUpdate = id && id.length > 10

      if (isUpdate) {
        const { data, error } = await supabase.from('beneficios').update(dbPayload).eq('id', id).select(QUERY_SELECT_BENEFICIOS_FULL_JOIN as any).single()
        if (error) throw error
        return (data as unknown) as IBeneficiosDetalhados
      } else {
        const { data, error } = await supabase.from('beneficios').insert(dbPayload).select(QUERY_SELECT_BENEFICIOS_FULL_JOIN as any).single()
        if (error) throw error
        return (data as unknown) as IBeneficiosDetalhados
      }
    } catch (error) {
      console.error('Erro ao salvar o beneficio:', error)
      throw error
    }
  }

  static async inactivateBeneficio(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('beneficios').update({ ativo: false }).eq('id', id)
      if (error) throw error
    } catch (error) {
      console.error('Erro ao inativar o beneficio:', error)
      throw error
    }
  }
}
