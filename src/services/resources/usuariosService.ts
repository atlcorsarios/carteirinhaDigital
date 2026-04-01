// Models
import type { IUser } from '@/classes/models/resources/ModelUsuarios'
import type { IFilterColumn } from '@/classes/models/ModelFilterColumns'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import { supabase } from '../supabase'

export class UsersService {
  static async getUserById(idUsuario: string): Promise<IUser> {
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', idUsuario).single()
    if (error) throw error
    return data as IUser
  }

  static async paginationsUsers(payload: TPayloadRequestPagination, columnsConfig: IFilterColumn[]): Promise<IUser[]> {
    try {
      let query = supabase
        .from('usuarios')
        .select('*, enderecos (cep, rua, bairro, cidade, estado, numero, complemento)')

      query = applySupabaseFilters(query, payload.filters, columnsConfig);

      if (payload.cursor) query = query.gt('id', payload.cursor)
      if (payload.limit) query = query.limit(payload.limit)
      query = query.order('id', { ascending: true })

      const { data, error } = await query

      if (error) throw error

      return data.map((user: any) => ({
        ...user,
        enderecoFormatado: user.enderecos
          ? `${user.enderecos.rua}, ${user.enderecos.numero} - ${user.enderecos.cidade}/${user.enderecos.estado}`
          : 'Endereço não cadastrado'
      })) as IUser[]

    } catch (error) {
      console.error('Erro na paginação do Supabase:', error)
      throw error
    }
  }

  static async saveUser(user: Partial<IUser>): Promise<IUser> {
    try {
      const { id, ...rawPayload } = user;
      const dbPayload: Record<string, any> = {};

      for (const [key, value] of Object.entries(rawPayload)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) continue;
        dbPayload[key] = value === '' ? null : value;
      }

      const isUpdate = id && id.length > 10;

      if (isUpdate) {
        const { data, error } = await supabase.from('usuarios').update(dbPayload).eq('id', id).select('*, enderecos(*)').single();
        if (error) throw error;
        return data as IUser;
      } else {
        const { data, error } = await supabase.from('usuarios').insert(dbPayload).select('*, enderecos(*)').single();
        if (error) throw error;
        return data as IUser;
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw error;
    }
  }

  static async inactivateUser(idUsuario: string): Promise<void> {
    try {
      const { error } = await supabase.from('usuarios').update({ usuario_ativo: false }).eq('id', idUsuario)
      if (error) throw error
    } catch (error) {
      console.error('Erro ao inativar usuário:', error)
      throw error
    }
  }
}
