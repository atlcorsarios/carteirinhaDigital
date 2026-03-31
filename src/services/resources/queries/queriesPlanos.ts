export const QUERY_SELECT_PLANOS_FULL_JOIN = `
  *,
  plano_beneficios (
    beneficios (
      *,
      parceiros (
        nome_fantasia
      )
    )
  )
`;
