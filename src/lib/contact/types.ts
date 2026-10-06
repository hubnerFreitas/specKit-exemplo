/**
 * Resultado do envio da solicitação de contato.
 * Ver specs/001-petshop-home-comercial/contracts/contact-endpoint.md
 */
export type SubmitResult =
  | { status: 'success' }
  | { status: 'field-errors'; fields: Record<string, string> }
  | { status: 'error'; retryAfterSeconds?: number };

/** Modo de operação do adaptador (research.md R-08). */
export type SubmitMode = 'endpoint' | 'composer';
