import type { IOnboardingData } from '@/classes/models/ModelOnboardingData'
import { supabase } from '@/services/supabase'
import { OtpService } from './otpService'

export class OnboardingService {
  static async finalizarCadastro(userId: string, data: IOnboardingData) {
    const otp = data.codigo_otp

    const payloadUpdate: any = {
      documento: data.documento,
      celular_contato: data.celular_contato,
      avatar_url: data.avatar_url
    }

    if (otp && otp.trim() !== '') {
      await OtpService.consumirOTP(userId, otp, 'ONBOARDING')
    } else {
      payloadUpdate.cargo = data.cargo
      payloadUpdate.usuario_ativo = data.cargo !== 'diretoria' && data.cargo !== 'associado'
    }

    const { error } = await supabase
      .from('usuarios')
      .update(payloadUpdate)
      .eq('id', userId)

    if (error) throw error

    return true
  }
}
