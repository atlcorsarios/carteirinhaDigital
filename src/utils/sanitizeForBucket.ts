export function sanitizeName(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .replace(/\s+/g, '-') // espaços -> hífen
    .replace(/[^a-z0-9-_]/g, '') // remove caracteres inválidos
}
