export const QUERY_SELECT_PROMOCOES_FULL_JOIN = `
  *,
  promocao_produtos (
    produtos (
      *
    )
  )
`;
