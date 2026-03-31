

export class PlanosService {
  static async fetchPlano(idPlano: string, fromTable: string = 'planos', withDetails: boolean = true): Promise<IPlanosDetalhados> {
    try {
      if (!idPlano) throw new Error('IdPlano undefined');
      const selectString = withDetails ? QUERY_SELECT_PLANOS_FULL_JOIN : '*';

      let query = supabase
        .from(fromTable)
        .select(selectString as any)
        .eq('id', idPlano)
        .single()

      const { data, error } = await query
      if (error) throw error
      return (data as unknown) as IPlanosDetalhados;
    } catch (error) {
      console.error('Erro na consulta de plano:', error);
      throw error
    }
  }

  static async paginationsPlanos(payload: TPayloadRequestPagination, fromTable: string = 'planos', withDetails: boolean = true): Promise<IPlanosDetalhados[]> {
    try {
      const selectString = withDetails ? QUERY_SELECT_PLANOS_FULL_JOIN : '*';
      let query = supabase.from(fromTable).select(selectString as any)

      query = applySupabaseFilters(query, payload.filters, ClassPlanos.filters)

      if (payload.cursor) query = query.gt('id', payload.cursor)
      if (payload.limit) query = query.limit(payload.limit)

      query = query.order('id', { ascending: true })
      const { data, error } = await query

      if (error) throw error
      return (data as unknown) as IPlanosDetalhados[];
    } catch (error) {
      console.error('Erro na paginação de planos:', error);
      throw error
    }
  }

  static async savePlano(plano: Partial<IPlanosDetalhados>): Promise<IPlanosDetalhados> {
    try {
      const { id, plano_beneficios, ...rawPayload } = plano
      const dbPayload: Record<string, any> = {}

      for (const [key, value] of Object.entries(rawPayload)) {
        if (key === 'beneficios' || key === 'plano_beneficios') continue;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) continue;
        dbPayload[key] = value === '' ? null : value
      }

      const isUpdate = id && id.length > 10

      if (isUpdate) {
        const { data, error } = await supabase.from('planos').update(dbPayload).eq('id', id).select(QUERY_SELECT_PLANOS_FULL_JOIN as any).single()
        if (error) throw error
        return (data as unknown) as IPlanosDetalhados
      } else {
        const { data, error } = await supabase.from('planos').insert(dbPayload).select(QUERY_SELECT_PLANOS_FULL_JOIN as any).single()
        if (error) throw error
        return (data as unknown) as IPlanosDetalhados
      }
    } catch (error) {
      console.error('Erro ao salvar o plano:', error)
      throw error
    }
  }

  static async inactivatePlano(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('planos').update({ ativo: false }).eq('id', id)
      if (error) throw error
    } catch (error) {
      console.error('Erro ao inativar o plano:', error)
      throw error
    }
  }
}
