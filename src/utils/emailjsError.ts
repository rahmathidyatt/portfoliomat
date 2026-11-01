/**
 * Translate EmailJS failures into actionable, non-sensitive messages.
 * A status code is a clue, not proof of the underlying account/config problem.
 */
export type EmailIssue = 'request' | 'permission' | 'rate-limit' | 'service' | 'network' | 'unknown';

export function summarizeEmailJsError(error: unknown): { status: number | null; issue: EmailIssue } {
  const rawStatus = error && typeof error === 'object' && 'status' in error
    ? (error as { status: unknown }).status
    : null;
  const status = typeof rawStatus === 'number' && Number.isInteger(rawStatus) &&
    rawStatus >= 0 && rawStatus <= 599 ? rawStatus : null;

  if (status === 400 || status === 404 || status === 422) return { status, issue: 'request' };
  if (status === 401 || status === 403) return { status, issue: 'permission' };
  if (status === 429) return { status, issue: 'rate-limit' };
  if (status !== null && status >= 500) return { status, issue: 'service' };
  if (status === 0 || error instanceof TypeError) return { status, issue: 'network' };
  return { status, issue: 'unknown' };
}

export function getEmailJsFailureMessage(error: unknown, language: 'en' | 'id', email: string): string {
  const { issue } = summarizeEmailJsError(error);
  const messages = {
    en: {
      request: 'The contact form could not be processed. Please contact me directly at ',
      permission: 'The messaging service is currently unavailable. Please email me directly at ',
      'rate-limit': 'Too many messages were sent recently. Please try later or email me at ',
      service: 'The messaging service is temporarily unavailable. Please email me at ',
      network: 'Could not connect to the messaging service. Please check your connection or email me at ',
      unknown: 'Message could not be sent. Please email me directly at ',
    },
    id: {
      request: 'Formulir kontak belum dapat diproses. Silakan hubungi saya melalui email ',
      permission: 'Layanan pengiriman pesan sedang tidak tersedia. Silakan kirim email ke ',
      'rate-limit': 'Terlalu banyak pesan dikirim. Coba lagi nanti atau hubungi saya melalui email ',
      service: 'Layanan pesan sementara tidak tersedia. Silakan kirim email ke ',
      network: 'Tidak dapat terhubung ke layanan pesan. Periksa koneksi atau kirim email ke ',
      unknown: 'Pesan belum dapat dikirim. Silakan hubungi saya melalui email ',
    },
  } as const;

  return messages[language][issue] + email + '.';
}
