import { createClient } from './supabase/server';

export async function saveResponse(entrada, resposta) {
  try {
    const supabase = await createClient();
    if (!supabase) return false;
    const { error } = await supabase.from('respostas').insert({ entrada, resposta });
    return !error;
  } catch {
    return false;
  }
}

export async function getHistory(userId) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Histórico indisponível');
  const { data, error } = await supabase.from('respostas')
    .select('id, entrada, resposta, criado_em')
    .eq('user_id', userId)
    .order('criado_em', { ascending: false });
  if (error) throw new Error('Histórico indisponível');
  return data || [];
}
