import { ClassNotifications } from '@/classes/resources/ClassNotificacoes'
import type { INotification } from '@/classes/models/resources/ModelNotifications'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import { supabase } from '../supabase'

export class NotificationsServices {
  static async fetchNotificacao(idNotificacao: string, fromTable: string = 'notificacoes'): Promise<INotification> {
    try {
      if (!idNotificacao) throw new Error('idNotificacao undefined');

      let query = supabase.from(fromTable).select('*').eq('id', idNotificacao).single()
      const { data, error } = await query

      if (error) throw error
      return data as INotification;
    } catch (error) {
      console.error('Erro na consulta de Notificação:', error);
      throw error
    }
  }

  static async paginationsNotificacoes(payload: TPayloadRequestPagination, fromTable: string = 'vw_notificacoes'): Promise<INotification[]> {
    try {
      let query = supabase.from(fromTable).select('*')

      query = applySupabaseFilters(query, payload.filters, ClassNotifications.filters)

      if (payload.cursor) query = query.gt('id', payload.cursor)
      if (payload.limit) query = query.limit(payload.limit)

      query = query.order('id', { ascending: true })
      const { data, error } = await query

      if (error) throw error
      return data as INotification[];
    } catch (error) {
      console.error('Erro na paginação de Notificações:', error);
      throw error
    }
  }

}
