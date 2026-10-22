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
  };
  return messages[error?.code] || 'Não foi possível concluir a operação. Tente novamente em alguns instantes.';
}
