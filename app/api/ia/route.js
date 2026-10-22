import { desafio } from '../../../desafio';
import { getUser } from '../../../lib/supabase/server';
import { saveResponse } from '../../../lib/history';

export const runtime = 'nodejs';
export const maxDuration = 60;

function text(message, status = 200) {
  return new Response(message, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store' },
  });
}

export async function POST(request) {
  if (!await getUser()) return text('Entre na sua conta para analisar suas respostas.', 401);
  let campos;
  try {
    campos = await request.json();
  } catch {
    return text('Envie os campos em um formato válido.', 400);
  }
  if (!campos || typeof campos !== 'object' || Array.isArray(campos)
    || desafio.campos.some(({ id }) => typeof campos[id] !== 'string' || campos[id].length > 10000)) {
    return text('Preencha os campos com textos de até 10.000 caracteres cada.', 400);
  }
  async function finish(content) {
    const entrada = desafio.campos.map(({ id, rotulo }) => `${rotulo}\n${campos[id]}`).join('\n\n');
    const saved = await saveResponse(entrada, content);
    const response = text(content);
    if (!saved) response.headers.set('X-History-Saved', 'false');
    return response;
  }
  if (desafio.modoTeste) {
    return finish('MODO DE TESTE — exemplo de avaliação, sem chamar a IA.\n\n'
      + [1, 2, 3].map(numero => `RESPOSTA ${numero}\nNOTA: 7 de 10 (exemplo)\nO QUE FICOU BOM: Você apresentou uma ideia para a entrevista.\nO QUE MELHORAR: Acrescente um exemplo concreto do seu dia a dia.\nCOMO FICARIA MELHOR: Conte o que aconteceu, o que você fez e o que aprendeu.`).join('\n\n')
      + '\n\nPraticar é um passo para ganhar confiança!');
  }
  if (!process.env.OPENROUTER_API_KEY) return text('A IA ainda não foi configurada. Configure OPENROUTER_API_KEY no servidor.', 503);
  // One pass keeps placeholders inside a user's answer literal.
  const prompt = desafio.prompt.replace(/\{([^{}]+)\}/g, (placeholder, id) =>
    desafio.campos.some(campo => campo.id === id) ? campos[id] : placeholder);
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: desafio.modelo, messages: [{ role: 'user', content: prompt }], max_tokens: 900 }),
      signal: AbortSignal.timeout(55000),
    });
    if (response.status === 429) return text('Você atingiu o limite de uso de hoje.', 429);
    if (response.status === 401) return text('Chave da IA inválida.', 401);
    if (!response.ok) return text('O serviço de IA não conseguiu concluir a análise. Tente novamente em alguns instantes.', 502);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) return text('A IA não enviou uma resposta. Tente novamente.', 502);
    return await finish(content);
  } catch {
    return text('Não foi possível conectar ao serviço de IA. Tente novamente em alguns instantes.', 502);
  }
}
