export const QUERY_SELECT_BENEFICIOS_FULL_JOIN = `
  *,
  parceiro:parceiros (
    nome_fantasia,
    data_renovacao,
    ativo,
    usuarios (
      username,
      avatar_url,
      celular_contato
    )
  )
`;
