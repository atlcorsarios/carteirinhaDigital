import { RenovacoesService } from "../resources/renovacoesService"
import { supabase } from "../supabase"

export class OtpService {
  static async consumirOTP(userId: string | number, codigo: string | number, origem: string = 'PROFILE') {
    try {
      const otp = String(codigo)
      const { data, error: rpcError } = await supabase.rpc('validar_codigo_otp', {
        p_user_id: userId,
        p_codigo: codigo
      })

      if (rpcError) throw new Error(rpcError.message)

      else {
        await RenovacoesService.criarRenovacao({
          id_usuario: String(userId),
          nsu_transacao: `OTP-${otp.toUpperCase()}-${Date.now()}`,
          nsu_pedido: `RESGATE_OTP_${origem}`,
          valor: 0,
          status_transacao: 'aprovada',
        })
      }

      return data
    } catch (error) {
      throw error
    }
  }
}
