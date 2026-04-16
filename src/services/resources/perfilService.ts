import type { IUser } from '@/classes/models/resources/ModelUsuarios'
import { supabase } from '@/services/supabase'
import { OtpService } from '../security/otpService'

export class profileServices {
  static async salvarDadosUsuario(userId: string | number, data: IUser & { codigo_otp?: string, nome_fantasia?: string }) {
    const payload: any = { ...data }
    const otp = payload.codigo_otp
    const novo_cargo = payload.cargo
    const novo_nome_fantasia = payload.nome_fantasia

    delete payload.codigo_otp
    delete payload.nome_fantasia

    if (otp && otp.trim() !== '') {
      await OtpService.consumirOTP(userId as string, otp)
      delete payload.cargo
    } else {
      if (novo_cargo === 'diretoria' || novo_cargo === 'associado') {
        delete payload.cargo
      }
    }

    const { error } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', userId)

    if (error) throw error

    if (novo_cargo === 'parceiro') {
      const { data: parceiroAntigo } = await supabase
        .from('parceiros')
        .select('id_usuario, data_renovacao')
        .eq('id_usuario', userId)
        .maybeSingle()

      if (parceiroAntigo) {
        const { error: pErr } = await supabase
          .from('parceiros')
          .update({
            nome_fantasia: novo_nome_fantasia || 'Parceiro em Avaliação'
          })
          .eq('id_usuario', userId)

        if (pErr) throw pErr

      } else {
        const dataRenovacao = new Date()
        dataRenovacao.setFullYear(dataRenovacao.getFullYear() + 2)

        const parceiroPayload = {
          id_usuario: userId,
          nome_fantasia: novo_nome_fantasia || 'Parceiro em Avaliação',
          data_renovacao: dataRenovacao.toISOString().split('T')[0],
          ativo: true
        }

        const { error: pErr } = await supabase
          .from('parceiros')
          .insert(parceiroPayload)

        if (pErr) throw pErr
      }
    }

    return true
  }
}
