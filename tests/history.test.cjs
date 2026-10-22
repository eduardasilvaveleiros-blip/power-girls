const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const vm = require('node:vm');

async function loadHistory(client) {
  const context = vm.createContext({});
  const server = new vm.SyntheticModule(['createClient'], function () {
    this.setExport('createClient', async () => client);
  }, { context });
  const history = new vm.SourceTextModule(await readFile('lib/history.js', 'utf8'), { context });
  await history.link(() => server);
  await history.evaluate();
  return history.namespace;
}

test('grava somente entrada e resposta usando cliente da sessão, sem user_id externo', async () => {
  let saved;
  const history = await loadHistory({ from(table) {
    assert.equal(table, 'respostas');
    return { insert: async row => { saved = row; return { error: null }; } };
  } });
  assert.equal(await history.saveResponse('Vaga: atendimento', 'Avaliação'), true);
  assert.deepEqual(Object.keys(saved).sort(), ['entrada', 'resposta']);
  assert.equal(saved.entrada, 'Vaga: atendimento');
  assert.equal(saved.resposta, 'Avaliação');
});

test('histórico filtra a usuária atual e ordena do mais recente para o mais antigo', async () => {
  const records = [{ id: 'row-a' }];
  const history = await loadHistory({ from(table) {
    assert.equal(table, 'respostas');
    return { select(columns) {
      assert.equal(columns, 'id, entrada, resposta, criado_em');
      return { eq(column, value) {
        assert.equal(column, 'user_id');
        assert.equal(value, 'user-a');
        return { order: async (column, options) => {
          assert.equal(column, 'criado_em');
          assert.equal(options.ascending, false);
          return { data: records, error: null };
        } };
      } };
    } };
  } });
  assert.equal(await history.getHistory('user-a'), records);
});

test('falha de gravação não é apresentada como sucesso', async () => {
  for (const client of [null, { from: () => ({ insert: async () => ({ error: { message: 'private' } }) }) }, { from: () => { throw new Error('private'); } }]) {
    const history = await loadHistory(client);
    assert.equal(await history.saveResponse('entrada', 'resposta'), false);
  }
});

test('histórico indisponível apresenta erro seguro em vez de lista vazia', async () => {
  const history = await loadHistory(null);
  await assert.rejects(history.getHistory('user-a'), /Histórico indisponível/);
});
