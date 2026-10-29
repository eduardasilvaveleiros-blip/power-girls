const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const vm = require('node:vm');

async function loadActions(client) {
  const context = vm.createContext({});
  const errors = new vm.SourceTextModule(await readFile('lib/supabase/errors.js', 'utf8'), { context });
  const server = new vm.SyntheticModule(['createClient'], function () {
    this.setExport('createClient', async () => client);
  }, { context });
  const navigation = new vm.SyntheticModule(['redirect'], function () {
    this.setExport('redirect', path => { throw new Error(`REDIRECT:${path}`); });
  }, { context });
  const actions = new vm.SourceTextModule(await readFile('app/login/actions.js', 'utf8'), { context });
  await actions.link(specifier => ({
    'next/navigation': navigation,
    '../../lib/supabase/server': server,
    '../../lib/supabase/errors': errors,
  })[specifier]);
  await actions.evaluate();
  return actions.namespace;
}

function form(intent, password = 'senha-segura', email = 'garota@example.com') {
  return new Map(Object.entries({ intent, email, password }));
}

test('login envia as credenciais e redireciona quando há sessão', async () => {
  const actions = await loadActions({ auth: { signInWithPassword: async values => {
    assert.equal(values.email, 'garota@example.com');
    assert.equal(values.password, 'senha-segura');
    return { data: { session: { access_token: 'test' } }, error: null };
  } } });
  await assert.rejects(actions.authenticate({}, form('login')), /REDIRECT:\/$/);
});

test('cadastro com confirmação de e-mail informa o próximo passo', async () => {
  const actions = await loadActions({ auth: { signUp: async () => ({ data: { session: null }, error: null }) } });
  const result = await actions.authenticate({}, form('signup'));
  assert.match(result.message, /Verifique seu e-mail/);
});

test('cadastro com sessão automática redireciona para a página principal', async () => {
  const actions = await loadActions({ auth: { signUp: async () => ({ data: { session: {} }, error: null }) } });
  await assert.rejects(actions.authenticate({}, form('signup')), /REDIRECT:\/$/);
});

test('credenciais inválidas e erros desconhecidos são apresentados em português', async () => {
  for (const [code, expected] of [
    ['invalid_credentials', 'E-mail ou senha incorretos.'],
    ['email_not_confirmed', 'Confirme seu e-mail antes de entrar.'],
    ['unexpected_error', 'Não foi possível concluir a operação. Tente novamente em alguns instantes.'],
  ]) {
    const actions = await loadActions({ auth: { signInWithPassword: async () => ({ error: { code, message: 'English private diagnostic' } }) } });
    assert.equal((await actions.authenticate({}, form('login'))).error, expected);
  }
});

test('validações e configuração ausente impedem chamadas de autenticação', async () => {
  const actions = await loadActions(null);
  assert.match((await actions.authenticate({}, form('signup', '123'))).error, /pelo menos 6/);
  assert.match((await actions.authenticate({}, form('login', '', 'inválido'))).error, /e-mail completo/);
  assert.match((await actions.authenticate({}, form('login'))).error, /não foi configurado/);
});

test('falhas de rede não expõem erros internos', async () => {
  const actions = await loadActions({ auth: { signInWithPassword: async () => { throw new Error('fetch failed'); } } });
  assert.match((await actions.authenticate({}, form('login'))).error, /Não foi possível conectar/);
});

test('sair encerra a sessão antes do redirecionamento e informa falhas', async () => {
  let signedOut = false;
  const actions = await loadActions({ auth: { signOut: async () => { signedOut = true; return { error: null }; } } });
  await assert.rejects(actions.signOut(), /REDIRECT:\/login$/);
  assert.equal(signedOut, true);
  const failed = await loadActions({ auth: { signOut: async () => ({ error: { message: 'failure' } }) } });
  assert.equal((await failed.signOut()).error, 'Não foi possível sair. Tente novamente.');
});

test('validação identifica o campo incorreto sem devolver a senha', async () => {
  const actions = await loadActions(null);
  for (const email of ['', 'sem-arroba', 'nome@', 'nome@dominio']) {
    const result = await actions.authenticate({}, form('login', 'senha-secreta', email));
    assert.equal(result.field, 'email');
    assert.match(result.error, /e-mail completo/);
    assert.equal(JSON.stringify(result).includes('senha-secreta'), false);
  }
  const missing = await actions.authenticate({}, form('login', ''));
  assert.equal(missing.field, 'password');
});

test('login remove espaços nas extremidades do e-mail sem alterar a senha', async () => {
  const actions = await loadActions({ auth: { signInWithPassword: async values => {
    assert.equal(values.email, 'garota@example.com');
    assert.equal(values.password, ' senha com espaços ');
    return { data: { session: {} }, error: null };
  } } });
  await assert.rejects(actions.authenticate({}, form('login', ' senha com espaços ', ' garota@example.com ')), /REDIRECT:\/$/);
});

test('login reconhece respostas antigas sem código em vez de mensagem genérica', async () => {
  for (const [message, expected] of [
    ['Invalid login credentials', /E-mail ou senha incorretos/],
    ['Email not confirmed', /Confirme seu e-mail/],
    ['Invalid API key', /mesmo projeto Supabase/],
    ['Email logins are disabled', /login por e-mail está desativado/],
  ]) {
    const actions = await loadActions({ auth: { signInWithPassword: async () => ({ error: { message, status: 400 } }) } });
    assert.match((await actions.authenticate({}, form('login'))).error, expected);
  }
});

test('limite e indisponibilidade não são apresentados como senha incorreta', async () => {
  for (const [status, expected] of [[429, /Muitas tentativas/], [503, /temporariamente indisponível/]]) {
    const actions = await loadActions({ auth: { signInWithPassword: async () => ({ error: { status, message: 'private diagnostic' } }) } });
    const result = await actions.authenticate({}, form('login'));
    assert.match(result.error, expected);
    assert.doesNotMatch(result.error, /private diagnostic/);
  }
});

test('login sem sessão nunca é apresentado como cadastro a confirmar', async () => {
  const actions = await loadActions({ auth: { signInWithPassword: async () => ({ data: { session: null }, error: null }) } });
  const result = await actions.authenticate({}, form('login'));
  assert.match(result.error, /iniciar sua sessão/);
  assert.equal(result.message, undefined);
});

test('erro de login não tenta criar outra conta automaticamente', async () => {
  const actions = await loadActions({ auth: {
    signInWithPassword: async () => ({ error: { code: 'invalid_credentials' } }),
    signUp: async () => { assert.fail('Login não pode criar outra conta'); },
  } });
  assert.equal((await actions.authenticate({}, form('login'))).error, 'E-mail ou senha incorretos.');
});
