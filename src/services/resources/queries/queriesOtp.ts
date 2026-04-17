export const QUERY_SELECT_OTP_FULL_JOIN = `
  *,
  usuario_destino:usuarios!codigos_otp_usuario_destino_id_fkey (
    email,
    username,
    avatar_url,
    celular_contato,
    cargo,
    usuario_ativo
  ),
  usuario_gerador:usuarios!codigos_otp_gerado_por_fkey (
    email,
    username,
    avatar_url,
    celular_contato,
    cargo,
    usuario_ativo
  ),
  plano:planos (
    id,
    nome,
    descricao,
    preco,
    dias_validade,
    ativo,
    created_at
  )
`;
