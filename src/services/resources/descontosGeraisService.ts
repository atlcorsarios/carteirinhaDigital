import { ClassDescontosGerais } from '@/classes/resources/ClassDescontosGerais'
import type { IDescontosGerais } from '@/classes/models/resources/ModelIDescontosGerais'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import { supabase } from '../supabase'

export class DescontosGeraisService {
  static async fetchDesconto(idDesconto: string, fromTable: string = 'descontos_gerais'): Promise<IDescontosGerais> {
    try {
      if (!idDesconto) throw new Error('IdDesconto undefined');

      let query = supabase.from(fromTable).select('*').eq('id', idDesconto).single()
      const { data, error } = await query

      if (error) throw error
      return data as IDescontosGerais;
    } catch (error) {
      console.error('Erro na consulta de Desconto Geral:', error);
      throw error
    }
  }

  static async paginationsDescontos(payload: TPayloadRequestPagination, fromTable: string = 'descontos_gerais'): Promise<IDescontosGerais[]> {
    try {
      let query = supabase.from(fromTable).select('*')

      query = applySupabaseFilters(query, payload.filters, ClassDescontosGerais.filters)

      if (payload.cursor) query = query.gt('id', payload.cursor)
      if (payload.limit) query = query.limit(payload.limit)

      query = query.order('id', { ascending: true })
      const { data, error } = await query

      if (error) throw error
      return data as IDescontosGerais[];
    } catch (error) {
      console.error('Erro na paginação de Descontos Gerais:', error);
      throw error
    }
  }

  static async saveDesconto(desconto: Partial<IDescontosGerais>): Promise<IDescontosGerais> {
    try {
      const { id, ...rawPayload } = desconto
      const dbPayload: Record<string, any> = {}

      for (const [key, value] of Object.entries(rawPayload)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) continue;
        dbPayload[key] = value === '' ? null : value
      }

      const isUpdate = id && id.length > 10

      if (isUpdate) {
        const { data, error } = await supabase.from('descontos_gerais').update(dbPayload).eq('id', id).select('*').single()
        if (error) throw error
        return data as IDescontosGerais
      } else {
        const { data, error } = await supabase.from('descontos_gerais').insert(dbPayload).select('*').single()
        if (error) throw error
        return data as IDescontosGerais
      }
    } catch (error) {
      console.error('Erro ao salvar o Desconto Geral:', error)
      throw error
    }
  }

  static async inactivateDesconto(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('descontos_gerais').update({ ativo: false }).eq('id', id)
      if (error) throw error
    } catch (error) {
      console.error('Erro ao inativar o Desconto Geral:', error)
      throw error
    }
  }
}
