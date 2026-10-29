const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const vm = require('node:vm');

async function load(logs = []) {
  const context = vm.createContext({ console: { error: (...args) => logs.push(args) } });
  const module = new vm.SourceTextModule(await readFile('lib/supabase/errors.js', 'utf8'), { context });
  await module.link(() => {});
  await module.evaluate();
  return module.namespace;
}

test('diagnóstico registra só operação, código e status, sem dados da conta', async () => {
  const logs = [];
  const errors = await load(logs);
  errors.logAuthFailure('login', { code: 'invalid_credentials', status: 400, message: 'private details', email: 'private@example.com', password: 'private-password' });
  const entry = logs[0][1];
  assert.deepEqual(Object.keys(entry).sort(), ['code', 'operation', 'status']);
  assert.equal(entry.code, 'invalid_credentials');
  assert.equal(entry.status, 400);
  assert.doesNotMatch(JSON.stringify(logs), /private/);
});

test('códigos desconhecidos não exibem diagnóstico bruto nem propriedades herdadas', async () => {
  const errors = await load();
  for (const code of ['toString', '__proto__', 'unexpected_failure']) {
    const message = errors.authErrorMessage({ code, message: 'private details' });
    assert.equal(typeof message, 'string');
    assert.match(message, /Não foi possível/);
    assert.doesNotMatch(message, /private/);
  }
});
