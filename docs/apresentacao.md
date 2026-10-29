# Power Girls — Treino de entrevista

Roteiro inicial para cerca de 5 minutos. O visual será adaptado depois que a dupla enviar sua referência. Dividam as falas entre as integrantes e substituam os nomes na abertura.

## Slide 1 — Nossa ideia (30 segundos)

**Na tela**
- Power Girls
- Treino de entrevista para o primeiro emprego
- Nomes das integrantes

**Fala sugerida**
“Criamos uma ferramenta para ajudar jovens a treinar para uma entrevista de emprego. A pessoa informa a vaga, responde três perguntas e recebe uma avaliação para melhorar.”

## Slide 2 — O problema que queremos resolver (35 segundos)

**Na tela**
- Como falar sobre mim sem ter experiência profissional?
- Como explicar por que quero a vaga?
- Como contar uma situação difícil que resolvi?

**Fala sugerida**
“Quem busca o primeiro emprego pode ter dificuldade para reconhecer o valor das próprias experiências. Nossa proposta é oferecer um espaço para praticar, com orientações simples e respeitosas.”

## Slide 3 — Como o projeto funciona (40 segundos)

**Na tela**
1. Criar conta ou entrar.
2. Colar a descrição da vaga e responder às perguntas.
3. Receber nota, pontos positivos e sugestões para cada resposta.
4. Consultar as análises no histórico.

**Fala sugerida**
“A tela foi feita com Next.js. O Supabase cuida das contas e do histórico. A OpenRouter permite chamar a inteligência artificial pelo servidor. O GitHub guarda o código e a Vercel publica o site.”

## Slide 4 — Erros e dificuldades que enfrentamos (60 segundos)

**Na tela**
| Dificuldade | O que fizemos | O que aprendemos |
| --- | --- | --- |
| Encontrar onde colocar a chave da IA | Orientação para salvar OPENROUTER_API_KEY nas variáveis da Vercel | Chave privada fica no servidor, fora do código |
| Levar o código para o site | Enviamos branches e seguimos o fluxo de Pull Request e merge | Alteração local, código no GitHub e publicação são etapas diferentes |
| Respostas iguais para perguntas diferentes | Identificamos o modo de teste e ativamos a chamada real | Um exemplo fixo não é uma avaliação da IA |
| Não havia recuperação de senha | Implementamos pedido por e-mail e tela para nova senha | O acesso precisa prever esquecimento de senha |
| Campos sumiam depois de uma tentativa de login recusada | Reproduzimos no navegador e preservamos os campos | Precisamos testar também quando algo dá errado |

**Fala sugerida**
“O processo teve erros que nos ensinaram a investigar. Por exemplo, a repetição não era a IA avaliando mal: o site estava no modo de teste. Também percebemos que uma mensagem de erro precisa ajudar a pessoa a entender como continuar.”

## Slide 5 — Demonstração (60 segundos)

**Na tela**
- Login e opção “Esqueci minha senha”.
- Uma vaga e três respostas fictícias.
- Avaliação recebida.
- Histórico da conta, se o banco estiver configurado.

**Fala sugerida**
“Vamos mostrar um exemplo fictício. A proposta é melhorar a forma de apresentar experiências reais, sem inventar experiências profissionais.”

**Preparação da dupla**
- Antes da apresentação, confirmar que o deploy mais recente está Ready na Vercel.
- Testar o login com uma conta da dupla, sem mostrar senha ou chaves na projeção.
- Fazer uma análise curta e verificar a cota disponível da IA.
- Conferir a tabela respostas e suas regras de segurança no Supabase.
- Testar o histórico com duas contas: cada uma deve ver apenas suas próprias linhas.
- Testar o e-mail de recuperação no mesmo navegador em que o pedido foi feito.
- Se algum serviço falhar, mostrar uma captura anterior identificada como exemplo e explicar o limite. Não apresentar o modo de teste como resposta real da IA.

## Slide 6 — O que já construímos e o que falta validar (35 segundos)

**Na tela**
- Implementado: login, recuperação de senha, formulário de entrevista, rota de IA e histórico.
- Verificado localmente: testes automatizados, build e comportamento do formulário no navegador com autenticação simulada.
- Validação em produção: credenciais reais, envio de e-mail, disponibilidade da IA e isolamento do histórico entre contas.
- Próximo passo visual: aplicar a referência escolhida pela dupla.

**Fala sugerida**
“O código está implementado, mas o funcionamento completo também depende das configurações dos serviços. Por isso, separamos o que já testamos localmente do que precisamos conferir no site publicado.”

## Slide 7 — Conclusão (40 segundos)

**Na tela**
- Aprendemos a transformar uma ideia em uma aplicação.
- Aprendemos a ler erros, testar e corrigir.
- IA pode ajudar a treinar; não garante contratação.
- Próximo passo: melhorar o visual e testar com mais pessoas.

**Fala sugerida**
“O Power Girls nasceu como um treino para entrevistas e também virou um treino para nós: aprendemos a resolver problemas, trabalhar em dupla e cuidar das informações de quem usa o site. Nosso objetivo é ajudar jovens a se preparar com mais confiança, mantendo a responsabilidade de revisar as sugestões da IA.”
