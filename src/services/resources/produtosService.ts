import { ClassProdutos } from '@/classes/resources/ClassProdutos'
import type { IProdutos, IProdutosDetalhados } from '@/classes/models/resources/ModelIProdutos'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { QUERY_SELECT_PRODUTOS_FULL_JOIN } from './queries/queriesProdutos'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import { supabase } from '../supabase'

export class ProductsService {
  static async fetchProduct(idProduto: string, fromTable: string = 'vw_produtos_vitrine', withDetails: boolean = true): Promise<IProdutosDetalhados> {
    try {
      if (!idProduto) throw new Error('IdProduto undefined');

      const selectString = withDetails ? QUERY_SELECT_PRODUTOS_FULL_JOIN : '*';

      let query = supabase
      .from(fromTable)
      .select(selectString as any)
      .eq('id', idProduto)
      .single()

      const { data, error } = await query

      if (error) throw error
      return (data as unknown) as IProdutosDetalhados;

    } catch (error) {
      console.error('Erro na consulta de produto:', error);
      throw error
    }
  }

  static async paginationsProducts(payload: TPayloadRequestPagination, fromTable: string = 'vw_produtos_vitrine', withDetails: boolean = true): Promise<IProdutosDetalhados[]> {
    try {
      const selectString = withDetails ? QUERY_SELECT_PRODUTOS_FULL_JOIN : '*';
      let query = supabase
        .from(fromTable)
        .select(selectString as any)

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
      return (data as unknown) as IProdutosDetalhados[];

    } catch (error) {
      console.error('Erro na paginação de produtos:', error);
      throw error
    }
  }

  static async saveProduct(produto: Partial<IProdutos>): Promise<IProdutos> {
    try {
      const { id, ...rawPayload } = produto
      const dbPayload: Record<string, any> = {}

      for (const [key, value] of Object.entries(rawPayload)) {
        if (key === 'parceiro' || key === 'parceiros' || key === 'promocao' || key === 'promocoes' || key === 'promocao_produtos') continue;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) continue;

        dbPayload[key] = value === '' ? null : value
      }

      const isUpdate = id && id.length > 10

      if (isUpdate) {
        // --- UPDATE ---
        const { data, error } = await supabase
          .from('produtos')
          .update(dbPayload)
          .eq('id', id)
          .select(QUERY_SELECT_PRODUTOS_FULL_JOIN)
          .single()

        if (error) throw error
        return data as IProdutos

      } else {
        // --- INSERT ---
        const { data, error } = await supabase
          .from('produtos')
          .insert(dbPayload)
          .select(QUERY_SELECT_PRODUTOS_FULL_JOIN)
          .single()

        if (error) throw error
        return data as IProdutos
      }
    } catch (error) {
      console.error('Erro ao salvar o produto:', error)
      throw error
    }
  }

  static async inactivateProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('produtos')
        .update({ ativo: false })
        .eq('id', id)

      if (error)
        throw error
    } catch (error) {
      console.error('Erro ao inativar o produto:', error)
      throw error
    }
  }
}
