import { supabase } from '../supabase'

export class AssinaturaService {
  static async buscarAssinaturaPorUsuarioId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('usuario_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error)
      throw error
    }
  }
}
