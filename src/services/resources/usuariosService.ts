// Models
import type { IUser } from '@/classes/models/resources/ModelUsuarios'
import type { IFilterColumn } from '@/classes/models/ModelFilterColumns'
import type { TPayloadRequestPagination } from '@/classes/models/ModelHeaderPaginator'
import { applySupabaseFilters } from '@/utils/supabaseFilterUtils'
import { supabase } from '../supabase'

export class UsersService {
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
        enderecoFormatado: user.enderecos?.[0]
          ? `${user.enderecos[0].logradouro}, ${user.enderecos[0].numero} - ${user.enderecos[0].cidade}/${user.enderecos[0].estado}`
          : 'Endereço não cadastrado'
      })) as IUser[]

    } catch (error) {
      console.error('Erro na paginação do Supabase:', error)
      throw error
    }
  }

  static async getUserById(idUsuario: string): Promise<IUser> {
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', idUsuario).single()
    if (error) throw error
    return data as IUser
  }

  static async createUser(newUser: Partial<IUser>): Promise<IUser> {
    const { data, error } = await supabase.from('usuarios').insert(newUser).select().single()
    if (error) throw error
    return data as IUser
  }

  static async updateUser(idUsuario: string, user: Partial<IUser>): Promise<IUser> {
    const { data, error } = await supabase.from('usuarios').update(user).eq('id', idUsuario).select().single()
    if (error) throw error
    return data as IUser
  }

  static async deleteUser(idUsuario: string): Promise<void> {
    const { error } = await supabase.from('usuarios').delete().eq('id', idUsuario)
    if (error) throw error
  }
}
