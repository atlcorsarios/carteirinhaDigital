import type { IUser } from '@/classes/models/resources/ModelUsuarios'
import { supabase } from '@/services/supabase'
import { OtpService } from '../security/otpService'

export class profileServices {
  static async salvarDadosUsuario(userId: string | number, data: IUser & { codigo_otp?: string }) {
    const payload: any = { ...data }
    const otp = payload.codigo_otp

    delete payload.codigo_otp
    delete payload.cargo

    if (otp && otp.trim() !== '') {
      await OtpService.consumirOTP(userId, otp)
    }

    const { error } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', userId)

    if (error) throw error
    return true
  }
}
