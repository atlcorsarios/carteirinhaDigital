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
      const { error } = await supabase.from('usuarios').update(payloadUpdate).eq('id', userId)
      if (error) throw error

    } else {
      payloadUpdate.cargo = data.cargo
      payloadUpdate.usuario_ativo = data.cargo !== 'diretoria' && data.cargo !== 'associado'

      const { error } = await supabase.from('usuarios').update(payloadUpdate).eq('id', userId)
      if (error) throw error

      if (data.cargo === 'parceiro') {
        const parceiroPayload = {
          id_usuario: userId,
          nome_fantasia: data.nome_fantasia || 'Parceiro em Avaliação',
          data_renovacao: data.data_renovacao?.toISOString().split('T')[0],
          ativo: true
        }

        const { error: pErr } = await supabase.from('parceiros').upsert(parceiroPayload, { onConflict: 'id_usuario' })
        if (pErr) throw pErr

        await supabase.from('associados').update({ ativo: false }).eq('id_usuario', userId)
      }

      if (data.cargo === 'associado') {
        const associadoPayload = {
          id_usuario: userId,
          status_pagamento: 'pendente',
          ativo: true
        }

        const { error: aErr } = await supabase.from('associados').upsert(associadoPayload, { onConflict: 'id_usuario' })
        if (aErr) throw aErr

        await supabase.from('parceiros').update({ ativo: false }).eq('id_usuario', userId)
      }
    }

    return true
  }
}
