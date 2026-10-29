export function authErrorMessage(error) {
  const messages = {
    invalid_credentials: 'E-mail ou senha incorretos.',
    email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
    user_already_exists: 'Já existe uma conta com este e-mail. Tente entrar.',
    email_exists: 'Já existe uma conta com este e-mail. Tente entrar.',
    weak_password: 'Escolha uma senha mais forte, com pelo menos 6 caracteres.',
    same_password: 'Escolha uma senha diferente da senha atual.',
    otp_expired: 'Este link é inválido ou expirou. Solicite um novo link de recuperação.',
    email_address_invalid: 'Informe um e-mail válido.',
    email_address_not_authorized: 'Este e-mail não está autorizado para cadastro.',
    signup_disabled: 'A criação de contas está desativada no momento.',
    over_email_send_rate_limit: 'Muitos e-mails solicitados. Aguarde alguns minutos e tente novamente.',
    over_request_rate_limit: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    email_provider_disabled: 'O login por e-mail está desativado no Supabase. Habilite o provedor de e-mail nas configurações de autenticação.',
    user_banned: 'O acesso desta conta está desativado. Consulte a responsável pelo site.',
    request_timeout: 'O serviço de login demorou para responder. Tente novamente.',
  };
  if (Object.hasOwn(messages, error?.code)) return messages[error.code];

  // Some Supabase responses omit a structured code. Translate only known
  // messages; never show arbitrary provider diagnostics to the user.
  const legacy = {
    'invalid login credentials': 'invalid_credentials',
    'email not confirmed': 'email_not_confirmed',
    'user already registered': 'user_already_exists',
    'email logins are disabled': 'email_provider_disabled',
    'new password should be different from the old password': 'same_password',
  };
  const message = typeof error?.message === 'string' ? error.message.trim().toLowerCase().replace(/\.$/, '') : '';
  if (Object.hasOwn(legacy, message)) return messages[legacy[message]];
  if (message === 'invalid api key') return 'A configuração de autenticação do site é inválida. Confira a URL e a chave pública do mesmo projeto Supabase na Vercel.';
  if (error?.status === 429) return messages.over_request_rate_limit;
  if (error?.status >= 500 || error?.name === 'AuthRetryableFetchError') {
    return 'O serviço de login está temporariamente indisponível. Tente novamente em alguns instantes.';
  }
  return 'Não foi possível concluir a operação. Tente novamente em alguns instantes.';
}

export function logAuthFailure(operation, error) {
  const code = typeof error?.code === 'string' && /^[a-z0-9_]{1,64}$/.test(error.code) ? error.code : 'unknown';
  const status = Number.isInteger(error?.status) && error.status >= 0 && error.status <= 599 ? error.status : null;
  console.error('Falha na autenticação Supabase', { operation, code, status });
}
