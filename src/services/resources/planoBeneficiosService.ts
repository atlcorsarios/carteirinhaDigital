import type { IPlanoBeneficioPivot } from '@/classes/models/resources/ModelIPlanos';
import { supabase } from '@/services/supabase'

export class PlanoBeneficiosService {
  // Relacionamento N:N entre planos e benefícios
  static async getBeneficiosByPlanoId(planoId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('plano_beneficios')
        .select(`
          beneficios (
            id,
            descricao_beneficio,
            desconto_aplicavel,
            restricao_beneficio
          )
        `)
        .eq('id_plano', planoId);

      if (error) throw error;

      return data.map((item: any) => item.beneficios).filter(Boolean);
    } catch (error) {
      console.error('Erro ao buscar benefícios do plano:', error);
      return [];
    }
  }

  static async saveRelationship(planoId: string, plano_beneficios?: IPlanoBeneficioPivot[]): Promise<void> {
    try {
      if (plano_beneficios === undefined) return;

      const { error: delErr } = await supabase
        .from('plano_beneficios')
        .delete()
        .eq('id_plano', planoId);

      if (delErr) throw delErr;

        if (plano_beneficios.length > 0) {
          const payloadPonte = plano_beneficios.map((pivot: any) => {
            const beneficioId = pivot.beneficios?.id || pivot.id;

            return {
              id_plano: planoId,
              id_beneficio: beneficioId
            };
          }).filter((item: any) => item.id_beneficio);

          if (payloadPonte.length > 0) {
            const { error: insErr } = await supabase
              .from('plano_beneficios')
              .insert(payloadPonte);

            if (insErr) throw insErr;
          }
        }
    } catch (error) {
      console.error('Erro ao salvar os relacionamentos do plano:', error);
      throw error;
    }
  }
}
