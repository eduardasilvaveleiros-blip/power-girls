const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const vm = require('node:vm');

async function load(file, client, origin = 'https://power-girls.example') {
  const context = vm.createContext({ URL, Response });
  const server = new vm.SyntheticModule(['createClient'], function () {
    this.setExport('createClient', async () => client);
  }, { context });
  const headers = new vm.SyntheticModule(['headers'], function () {
    this.setExport('headers', async () => new Headers({ origin }));
  }, { context });
  const errors = new vm.SourceTextModule(await readFile('lib/supabase/errors.js', 'utf8'), { context });
  const module = new vm.SourceTextModule(await readFile(file, 'utf8'), { context });
  await module.link(name => name === 'next/headers' ? headers : name.endsWith('/errors') ? errors : server);
  await module.evaluate();
  return module.namespace;
}
const recovery = 'app/esqueci-senha/actions.js';
const update = 'app/redefinir-senha/actions.js';
const callback = 'app/auth/callback/route.js';
const form = values => new Map(Object.entries(values));

test('pedido de recuperação valida e-mail antes de chamar Supabase', async () => {
  const actions = await load(recovery, null);
  assert.match((await actions.requestPasswordReset({}, form({ email: 'invalido' }))).error, /e-mail válido/);
});

test('envia recuperação com endereço fixo de callback no domínio atual e mensagem neutra', async () => {
  let called = false;
  const actions = await load(recovery, { auth: { resetPasswordForEmail: async (email, options) => {
    called = true;
    assert.equal(email, 'garota@example.com');
    assert.equal(options.redirectTo, 'https://power-girls.example/auth/callback');
    return { error: null };
  } } });
  const result = await actions.requestPasswordReset({}, form({ email: ' garota@example.com ' }));
  assert.equal(called, true);
  assert.match(result.message, /Se este e-mail estiver cadastrado/);
  assert.match(result.message, /mesmo navegador/);
});

test('ausência de configuração, limites e falha de rede têm mensagens seguras', async () => {
  const missing = await load(recovery, null);
  assert.match((await missing.requestPasswordReset({}, form({ email: 'a@example.com' }))).error, /não foi configurada/);
  const limited = await load(recovery, { auth: { resetPasswordForEmail: async () => ({ error: { code: 'over_email_send_rate_limit', message: 'private' } }) } });
  assert.match((await limited.requestPasswordReset({}, form({ email: 'a@example.com' }))).error, /Aguarde/);
  const offline = await load(recovery, { auth: { resetPasswordForEmail: async () => { throw new Error('private'); } } });
  const result = await offline.requestPasswordReset({}, form({ email: 'a@example.com' }));
  assert.match(result.error, /Não foi possível enviar/);
  assert.doesNotMatch(result.error, /private/);
});

test('callback troca código por sessão e vai somente para redefinição local', async () => {
  const route = await load(callback, { auth: { exchangeCodeForSession: async code => {
    assert.equal(code, 'test-code');
    return { error: null };
  } } });
  const response = await route.GET(new Request('https://power-girls.example/auth/callback?code=test-code&next=https://evil.example'));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), 'https://power-girls.example/redefinir-senha');
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
});

test('callback sem código, expirado ou sem configuração nunca permite redefinição', async () => {
  for (const client of [null, { auth: { exchangeCodeForSession: async () => ({ error: { message: 'private' } }) } }, { auth: { exchangeCodeForSession: async () => { throw new Error('private'); } } }]) {
    const route = await load(callback, client);
    for (const suffix of ['', '?code=expired']) {
      const response = await route.GET(new Request('https://power-girls.example/auth/callback' + suffix));
      assert.equal(response.headers.get('location'), 'https://power-girls.example/esqueci-senha?erro=link');
    }
  }
});

test('nova senha exige tamanho mínimo, confirmação e sessão verificada', async () => {
  const actions = await load(update, { auth: { getUser: async () => ({ data: { user: null }, error: null }) } });
  assert.match((await actions.updatePassword({}, form({ password: '123', confirmation: '123' }))).error, /6 caracteres/);
  assert.match((await actions.updatePassword({}, form({ password: 'nova-senha', confirmation: 'outra-senha' }))).error, /não coincidem/);
  assert.match((await actions.updatePassword({}, form({ password: 'nova-senha', confirmation: 'nova-senha' }))).error, /sessão expirou/);
});

test('nova senha é atualizada apenas na conta da sessão autenticada', async () => {
  let updated = false;
  const actions = await load(update, { auth: {
    getUser: async () => ({ data: { user: { id: 'user-a' } }, error: null }),
    updateUser: async values => {
      updated = true;
      assert.deepEqual(Object.keys(values), ['password']);
      assert.equal(values.password, 'nova-senha');
      return { error: null };
    },
  } });
  const result = await actions.updatePassword({}, form({ password: 'nova-senha', confirmation: 'nova-senha', user_id: 'user-b' }));
  assert.equal(updated, true);
  assert.match(result.message, /senha foi alterada/);
});

test('erros de senha fraca ou repetida são traduzidos sem expor detalhes', async () => {
  for (const [code, expected] of [['weak_password', /mais forte/], ['same_password', /diferente/]]) {
    const actions = await load(update, { auth: {
      getUser: async () => ({ data: { user: { id: 'user-a' } }, error: null }),
      updateUser: async () => ({ error: { code, message: 'private' } }),
    } });
    const result = await actions.updatePassword({}, form({ password: 'nova-senha', confirmation: 'nova-senha' }));
    assert.match(result.error, expected);
    assert.doesNotMatch(result.error, /private/);
  }
});
