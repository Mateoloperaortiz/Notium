/**
 * Hash SHA-256 en hexadecimal. Se usa para no guardar contrasenas en claro
 * dentro de LocalStorage, aunque la aplicacion sea 100 % de lado del cliente.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  if (typeof crypto === 'undefined' || crypto.subtle === undefined) {
    console.warn('[hash] crypto.subtle no esta disponible; se usa un hash de respaldo.')
    return fallbackHash(plainPassword)
  }

  const bytes = new TextEncoder().encode(plainPassword)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyPassword(
  plainPassword: string,
  expectedHash: string,
): Promise<boolean> {
  const hash = await hashPassword(plainPassword)
  return hash === expectedHash
}

/** Solo para contextos sin `crypto.subtle` (por ejemplo http en una IP de la red local). */
function fallbackHash(text: string): string {
  let hash = 5381
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 33) ^ text.charCodeAt(index)
  }
  return `fallback-${(hash >>> 0).toString(16)}`
}
