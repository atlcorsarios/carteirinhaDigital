import type { IUser } from '@/classes/models/resources/ModelUser'
import { supabase } from '@/services/supabase'

export class profileServices {
  static async salvarDadosUsuario(userId: string | number, data: IUser & { codigo_otp?: string }) {
    const payload: any = { ...data }
    const otp = payload.codigo_otp

    delete payload.codigo_otp

    if (otp && otp.trim() !== '') {
      const { error: rpcError } = await supabase.rpc('validar_codigo_otp', {
        p_user_id: userId,
        p_codigo: otp.toUpperCase(),
        p_novo_cargo: payload.cargo
      })

      if (rpcError) {
        throw new Error(rpcError.message)
      }
    }

    const { error } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', userId)

    if (error) throw error
    return true
  }
}
