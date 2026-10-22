const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const vm = require('node:vm');

async function loadRoute({ mode = true, user = { id: 'test-user' }, key = 'test-key', save = async () => true, fetcher = () => { throw new Error('Unexpected external call'); } } = {}) {
  const context = vm.createContext({ Response, AbortSignal, fetch: fetcher, process: { env: { OPENROUTER_API_KEY: key } } });
  const config = new vm.SourceTextModule(await readFile('desafio.js', 'utf8'), { context });
  await config.link(() => {});
  await config.evaluate();
  config.namespace.desafio.modoTeste = mode;
  const server = new vm.SyntheticModule(['getUser'], function () {
    this.setExport('getUser', async () => user);
  }, { context });
  const history = new vm.SyntheticModule(['saveResponse'], function () {
    this.setExport('saveResponse', save);
  }, { context });
  const route = new vm.SourceTextModule(await readFile('app/api/ia/route.js', 'utf8'), { context });
  await route.link(name => name === '../../../desafio' ? config : name === '../../../lib/history' ? history : server);
  await route.evaluate();
  return route.namespace.POST;
}
const fields = { vaga: 'Atendimento {resposta1}', resposta1: 'Ajudo na feira', resposta2: '', resposta3: 'Organizei as entregas' };
const request = (body = fields) => new Request('http://localhost/api/ia', { method: 'POST', body: JSON.stringify(body) });

test('API exige login antes de processar respostas', async () => {
  const post = await loadRoute({ user: null });
  const response = await post(request());
  assert.equal(response.status, 401);
  assert.match(await response.text(), /Entre na sua conta/);
});
test('modoTeste devolve exemplo sem chamar a IA nem precisar de chave', async () => {
  const post = await loadRoute({ key: '' });
  const response = await post(request());
  assert.equal(response.status, 200);
  assert.match(await response.text(), /MODO DE TESTE[\s\S]*RESPOSTA 3/);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
});
test('API rejeita JSON inválido, campos ausentes, tipos incorretos e textos grandes', async () => {
  const post = await loadRoute();
  for (const body of [null, {}, { ...fields, vaga: 123 }, { ...fields, vaga: 'x'.repeat(10001) }]) {
    assert.equal((await post(request(body))).status, 400);
  }
  assert.equal((await post(new Request('http://localhost/api/ia', { method: 'POST', body: '{' }))).status, 400);
});
test('chamada real monta prompt sem substituir marcadores no texto da usuária', async () => {
  const post = await loadRoute({ mode: false, fetcher: async (url, options) => {
    assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer test-key');
    const body = JSON.parse(options.body);
    assert.equal(body.model, 'openrouter/free');
    assert.equal(body.max_tokens, 900);
    assert.match(body.messages[0].content, /VAGA: Atendimento \{resposta1\}/);
    assert.match(body.messages[0].content, /RESPOSTA 1 \(sobre você\): Ajudo na feira/);
    return Response.json({ choices: [{ message: { content: 'Avaliação\nContinue praticando!' } }] });
  } });
  assert.equal(await (await post(request())).text(), 'Avaliação\nContinue praticando!');
});
test('erros 401 e 429 têm mensagens específicas sem expor detalhes do provedor', async () => {
  for (const [status, message] of [[401, 'Chave da IA inválida.'], [429, 'Você atingiu o limite de uso de hoje.']]) {
    const post = await loadRoute({ mode: false, fetcher: async () => new Response('private provider error', { status }) });
    const response = await post(request());
    assert.equal(response.status, status);
    assert.equal(await response.text(), message);
  }
});
test('configuração ausente, falha de rede e resposta vazia são tratadas', async () => {
  const noKey = await loadRoute({ mode: false, key: '' });
  assert.equal((await noKey(request())).status, 503);
  for (const fetcher of [async () => { throw new Error('private'); }, async () => Response.json({ choices: [] }), async () => new Response('private', { status: 500 })]) {
    const post = await loadRoute({ mode: false, fetcher });
    const response = await post(request());
    assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /private/);
  }
});

test('salva campos com rótulos e a avaliação na sessão atual', async () => {
  let saved;
  const post = await loadRoute({ save: async (entrada, resposta) => { saved = { entrada, resposta }; return true; } });
  const response = await post(request());
  const text = await response.text();
  assert.equal(saved.resposta, text);
  assert.match(saved.entrada, /Cole aqui a descrição da vaga\nAtendimento/);
  assert.match(saved.entrada, /Me fale um pouco sobre você\nAjudo na feira/);
  assert.match(saved.entrada, /Conte uma situação difícil que você resolveu\nOrganizei as entregas/);
});
test('falha ao salvar preserva a análise e sinaliza aviso na resposta', async () => {
  const post = await loadRoute({ save: async () => false });
  const response = await post(request());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-History-Saved'), 'false');
  assert.match(await response.text(), /MODO DE TESTE/);
});
