export const QUERY_SELECT_PRODUTOS_FULL_JOIN = `
  *, parceiro:parceiros (
    nome_fantasia,
    data_renovacao,
    ativo,
    usuarios (
      username,
      avatar_url,
      celular_contato
    )
  ),
  promocao:promocao_produtos (
    promocoes (*)
  )
`;
