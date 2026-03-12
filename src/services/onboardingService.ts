import type { OnboardingData } from '@/classes/models/ModelOnboardingData'
import { useSnackbar } from '@/composables/useSnackbar'
import { supabase } from '@/services/supabase'

export class OnboardingService {
  static async finalizarCadastro(userId: string, data: OnboardingData) {
    if (data.codigo_otp && data.codigo_otp.trim() !== '') {
      const { data: result, error } = await supabase.rpc('resgatar_otp_onboarding', {
        p_user_id: userId,
        p_codigo: data.codigo_otp.toUpperCase(),
        p_documento: data.documento,
        p_celular: data.celular_contato,
        p_avatar_url: data.avatar_url
      })

      if (error) throw error
      return result
    }

    const inativar = data.cargo === 'diretoria'
    const { error } = await supabase
      .from('usuarios')
      .update({
        cargo: data.cargo,
        documento: data.documento,
        celular_contato: data.celular_contato,
        avatar_url: data.avatar_url,
        usuario_ativo: !inativar
      })
      .eq('id', userId)

    if (error){
      useSnackbar().notify(error, 'error');
      throw error
    }

    return true
  }
}
