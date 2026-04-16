import { ClassOTP } from "@/classes/resources/ClassOTP";
import type { IOTPCode, IOTPCodeDetalhado } from "@/classes/models/resources/ModelIOTP";
import type { TPayloadRequestPagination } from "@/classes/models/ModelHeaderPaginator";
import { QUERY_SELECT_OTP_FULL_JOIN } from "./queries/queriesOtp";
import { applySupabaseFilters } from "@/utils/supabaseFilterUtils";
import { supabase } from "../supabase";

export class OtpResourceService {
  static async fetchOtp(idOtp: string, fromTable: string = 'codigos_otp', withDetails: boolean = true): Promise<IOTPCodeDetalhado> {
    try {
      if (!idOtp) throw new Error('idOtp undefined');

      const selectString = withDetails ? QUERY_SELECT_OTP_FULL_JOIN : '*';

      let query = supabase
      .from(fromTable)
      .select(selectString as any)
      .eq('id', idOtp)
      .single();

      const { data, error } = await query;

      if (error) throw error;
      return (data as unknown) as IOTPCodeDetalhado;
    } catch (error) {
      console.error('Erro na consulta de otpCode:', error);
      throw error
    }
  }

  static async paginationsOTP(payload: TPayloadRequestPagination, fromTable: string = 'codigos_otp', withDetails: boolean = true): Promise<IOTPCodeDetalhado[]> {
    try {
      const selectString = withDetails ? QUERY_SELECT_OTP_FULL_JOIN : '*';
      let query = supabase
        .from(fromTable)
        .select(selectString as any);

      query = applySupabaseFilters(query, payload.filters, ClassOTP.filters);

      if (payload.cursor) {
        query = query.lt('created_at', payload.cursor);
      }
      if (payload.limit) {
        query = query.limit(payload.limit);
      }

      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;

      if (error) throw error
      return (data as unknown) as IOTPCodeDetalhado[];

    } catch (error) {
      console.error('Erro na paginação de códigos otp:', error);
      throw error
    }
  }

  static async saveOTP(otpCode: Partial<IOTPCode>): Promise<IOTPCode> {
    try {
      const { id, ...rawPayload } = otpCode
      const dbPayload: Record<string, any> = {}

      for (const [key, value] of Object.entries(rawPayload)) {
        if (key === 'plano' || key === 'usuario_destino' || key === 'usuario_gerador') continue;

        if (value === '' || value === null || value === undefined) {
          dbPayload[key] = null;
          continue;
        }

        if (value instanceof Date) {
          dbPayload[key] = value.toISOString();
          continue;
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
          continue;
        }

        dbPayload[key] = value;
      }

      const isUpdate = id && id.length > 10

      if (isUpdate) {
        // --- UPDATE ---
        const { data, error } = await supabase
          .from('codigos_otp')
          .update(dbPayload)
          .eq('id', id)
          .select(QUERY_SELECT_OTP_FULL_JOIN)
          .single()

        if (error) throw error
        return data as IOTPCode

      } else {
        // --- INSERT ---
        const { data, error } = await supabase
          .from('codigos_otp')
          .insert(dbPayload)
          .select(QUERY_SELECT_OTP_FULL_JOIN)
          .single()

        if (error) throw error
        return data as IOTPCode
      }
    } catch (error) {
      console.error('Erro ao salvar o código otp:', error)
      throw error
    }
  }

  static async inactivateOTP(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('codigos_otp')
        .update({ usado: true })
        .eq('id', id)

      if (error)
        throw error
    } catch (error) {
      console.error('Erro ao inativar o código otp:', error)
      throw error
    }
  }
}
