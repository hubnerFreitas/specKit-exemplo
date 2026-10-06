# Feature Specification: Home Page Comercial do Petshop

**Feature Branch**: `001-petshop-home-comercial`

**Created**: 2026-10-06

**Status**: Draft

**Input**: User description: "Crie a especificação de uma página completa, profissional e comercial para um petshop, com foco em transmitir confiança, apresentar os serviços e produtos do negócio e aumentar a geração de contatos e agendamentos."

---

## Objetivo e Contexto de Negócio *(mandatory)*

### Objetivo principal da página

Converter visitantes que procuram um petshop em **contatos qualificados e solicitações de
agendamento**, provando em poucos segundos que o estabelecimento é real, organizado,
profissional e cuidadoso com os animais.

**Ação principal da página** (conforme Princípio I da Constituição): *acionar o contato do
petshop pelo WhatsApp para agendar um serviço*. Ações secundárias, em ordem de prioridade:
ligar por telefone, enviar o formulário de solicitação de agendamento, obter a rota até a loja.

### Objetivos secundários

| # | Objetivo | Como a página atende |
|---|----------|----------------------|
| OB-1 | Comunicar a proposta do negócio em segundos | Seção principal (hero) com proposta, prova e CTA acima da dobra |
| OB-2 | Apresentar o catálogo de serviços de forma compreensível | Seção de serviços com escopo, público-alvo e CTA por serviço |
| OB-3 | Informar que há produtos à venda na loja | Seção de produtos em destaque com consulta de disponibilidade |
| OB-4 | Reduzir a fricção do contato ao mínimo | CTAs recorrentes, acesso persistente no mobile, dados clicáveis |
| OB-5 | Eliminar as objeções que travam o contato | Diferenciais, prova social e perguntas frequentes |
| OB-6 | Ser encontrado por busca local | Estrutura semântica, NAP consistente, dados estruturados de negócio local |
| OB-7 | Permitir mensuração do resultado comercial | Todas as conversões rastreáveis por evento |

### Perfil do público

**Público primário — Tutor pesquisando petshop (decisor):**

- Tutor de cão e/ou gato, 25–55 anos, mora ou trabalha na região do petshop.
- Acessa predominantemente pelo **celular**, frequentemente a partir de uma busca no Google /
  Google Maps ("pet shop perto de mim", "banho e tosa em [bairro]") ou de indicação social.
- Tem pouco tempo e baixa paciência: decide em segundos se o negócio parece confiável.
- Preocupação central: **segurança e bem-estar do animal**, não preço isolado.
- Nível técnico baixo a médio; espera clareza, não navegação elaborada.

**Segmentos relevantes dentro do público primário:**

| Segmento | Situação | O que precisa primeiro |
|----------|----------|------------------------|
| Urgente | Precisa de banho/tosa ou atendimento esta semana | Telefone/WhatsApp e horário de funcionamento |
| Pesquisador | Está comparando 2–4 petshops | Serviços, diferenciais e depoimentos |
| Cauteloso | Já teve má experiência, ou tem pet idoso / ansioso / de porte grande | Prova de cuidado, equipe, estrutura e políticas |
| Recorrente | Já é cliente | Contato rápido e horários |

**Público secundário:**

- Tutor de primeira viagem (filhote recém-adotado), que precisa entender quais serviços existem
  e qual é o adequado para o seu caso.
- Pessoa buscando produtos (ração, acessórios, higiene) e verificando se a loja tem.

### Principais necessidades do usuário

- **N-1**: Entender, sem rolar a página, o que o negócio é, onde fica e que pode ser acionado agora.
- **N-2**: Saber exatamente quais serviços existem e se atendem o porte/espécie do seu animal.
- **N-3**: Saber se há produtos à venda e de que tipo.
- **N-4**: Ter uma forma de contato imediata, sem cadastro e sem formulário obrigatório.
- **N-5**: Saber onde o petshop está e se é fácil chegar.
- **N-6**: Encontrar motivos concretos para confiar (avaliações, tempo de atuação, equipe, estrutura).
- **N-7**: Resolver dúvidas de objeção (preço, duração, pets idosos/ansiosos, atendimento a
  gatos, necessidade de agendamento, formas de pagamento) sem precisar perguntar.
- **N-8**: Confirmar que o negócio está ativo e atende hoje (horário atual, canais que respondem).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Contato imediato do tutor com necessidade urgente (Priority: P1)

Um tutor abre a página no celular após buscar "pet shop perto de mim". Na primeira tela ele
entende qual é o petshop, o que ele faz, onde fica e que é bem avaliado, e aciona o botão de
WhatsApp para pedir um horário de banho e tosa — sem rolar a página e sem preencher nada.

**Why this priority**: é a jornada que gera receita direta e a razão de existir da página.
Entregue isoladamente, já é um MVP viável: um visitante consegue virar contato.

**Independent Test**: abrir a página em um dispositivo de 360px de largura, sem rolar, e
concluir o contato pelo WhatsApp com mensagem pré-preenchida; confirmar que o evento de
conversão foi registrado.

**Acceptance Scenarios**:

1. **Given** um visitante no celular (360×640) que acabou de abrir a página, **When** a primeira
   tela termina de carregar, **Then** ele vê a identidade do petshop, uma proposta de valor em
   uma frase, ao menos um elemento de prova (nota de avaliações, quantidade de avaliações ou
   anos de atuação), a cidade/bairro atendido e o CTA principal — tudo sem rolagem.
2. **Given** a página carregada no mobile, **When** o visitante toca no CTA principal de
   WhatsApp, **Then** o WhatsApp abre em conversa com o número do petshop, com mensagem
   pré-preenchida contextual (ex.: "Olá! Gostaria de agendar um banho e tosa.").
3. **Given** o visitante rolando a página em qualquer altura no mobile, **When** ele quer entrar
   em contato, **Then** existe um acesso de contato persistente visível que não cobre texto,
   botões nem o conteúdo do rodapé.
4. **Given** um visitante no desktop, **When** ele aciona o CTA de WhatsApp, **Then** a conversa
   abre no WhatsApp Web ou no aplicativo e, caso o canal não esteja disponível, telefone e
   formulário permanecem acessíveis como alternativa sem sair da página.
5. **Given** um visitante que acionou qualquer CTA de contato, **When** a ação ocorre, **Then**
   um evento de conversão identificando canal e seção de origem é registrado.

---

### User Story 2 - Avaliação dos serviços e pedido de agendamento (Priority: P2)

Um tutor quer saber se o petshop atende o caso do seu animal (porte, espécie, necessidade) e, ao
encontrar o serviço certo, solicita o agendamento a partir daquele serviço.

**Why this priority**: é a jornada que qualifica o contato. Sem ela os contatos chegam vagos e o
atendimento perde tempo; com ela a mensagem já chega com o serviço identificado.

**Independent Test**: percorrer a seção de serviços, abrir o detalhe de um serviço e disparar o
contato a partir dele, verificando que a mensagem pré-preenchida nomeia aquele serviço.

**Acceptance Scenarios**:

1. **Given** a seção de serviços, **When** o visitante a lê, **Then** cada serviço apresenta
   nome, o que é, para quem é (espécie/porte), o que está incluso, duração ou faixa de preço
   quando aplicável, e como contratar.
2. **Given** um serviço de interesse, **When** o visitante aciona o CTA daquele serviço, **Then**
   o contato é aberto com mensagem pré-preenchida citando o nome do serviço.
3. **Given** um tutor que prefere não usar WhatsApp, **When** ele escolhe solicitar agendamento
   pelo formulário, **Then** o formulário pede apenas os campos necessários, valida as entradas,
   exibe mensagens de erro úteis e confirma explicitamente o envio com a expectativa de retorno.
4. **Given** um tutor de gato ou de cão de porte grande, **When** ele percorre a seção de
   serviços, **Then** fica explícito se o serviço atende aquela espécie/porte.
5. **Given** o fim da seção de serviços, **When** o visitante termina de lê-la, **Then** há um
   CTA de contato naquele ponto de decisão, sem competir com outro CTA na mesma área.

---

### User Story 3 - Construção de confiança no tutor cauteloso (Priority: P3)

Um tutor que já teve uma experiência ruim, ou cujo pet é idoso/ansioso, precisa de evidências
concretas antes de entregar o animal: quem são as pessoas, como é o espaço, o que outros
clientes dizem e se o negócio é formalmente estabelecido.

**Why this priority**: converte o segmento mais desconfiado e mais caro de conquistar, e é o que
diferencia a página de um panfleto digital.

**Independent Test**: percorrer institucional, diferenciais e prova social e verificar que cada
afirmação de qualidade tem uma evidência verificável ao lado dela.

**Acceptance Scenarios**:

1. **Given** a seção institucional, **When** o visitante a lê, **Then** ela informa quem é o
   petshop, o tempo de atuação, a proposta de cuidado e ao menos um dado verificável (endereço
   físico, responsável, razão social/CNPJ ou registro profissional quando aplicável).
2. **Given** a seção de diferenciais, **When** o visitante a lê, **Then** cada diferencial é
   específico e verificável (ex.: "secagem sem gaiola de secagem automática"), não um elogio
   genérico.
3. **Given** a seção de prova social, **When** o visitante a lê, **Then** ela exibe depoimentos
   reais com identificação da pessoa e, quando houver, a nota agregada e a quantidade de
   avaliações, com link para a fonte pública.
4. **Given** qualquer afirmação de qualidade na página, **When** um revisor a audita, **Then**
   existe prova visível próxima a ela; afirmações sem prova são removidas.
5. **Given** o visitante logo após ler a prova social, **When** ele decide agir, **Then** há um
   CTA de contato imediatamente disponível naquele ponto.

---

### User Story 4 - Descoberta de produtos e resolução de dúvidas (Priority: P4)

Um tutor quer saber se resolve tudo no mesmo lugar — comprar ração/acessórios e esclarecer
dúvidas de preço, duração, pagamento e políticas — antes de acionar o contato.

**Why this priority**: amplia o ticket e remove objeções que fazem o visitante sair sem
contatar, mas não é pré-requisito para as jornadas P1–P3.

**Independent Test**: percorrer a seção de produtos em destaque e a seção de perguntas
frequentes e verificar que o visitante entende a oferta de produtos e encontra a resposta às
objeções principais sem sair da página.

**Acceptance Scenarios**:

1. **Given** a seção de produtos em destaque, **When** o visitante a lê, **Then** ela mostra
   categorias ou itens reais com imagem, nome, descrição curta e a forma de adquirir (consulta
   de disponibilidade e preço pelo contato, ou compra na loja física).
2. **Given** um produto de interesse, **When** o visitante aciona o CTA do produto, **Then** o
   contato abre com mensagem pré-preenchida citando o produto.
3. **Given** a seção de perguntas frequentes, **When** o visitante a consulta, **Then** ela
   responde às objeções de preço, duração, necessidade de agendamento, pets idosos/ansiosos,
   atendimento a gatos, formas de pagamento e política de atraso/cancelamento.
4. **Given** uma pergunta frequente recolhida, **When** o visitante a aciona por toque ou
   teclado, **Then** ela expande e recolhe, com o estado anunciável por leitor de tela.
5. **Given** o visitante na seção de perguntas frequentes, **When** a dúvida dele não está
   listada, **Then** há um CTA explícito para perguntar pelo canal de contato.

---

### User Story 5 - Localização, horários e descoberta orgânica (Priority: P5)

Um tutor precisa chegar fisicamente à loja — ou precisa encontrar o petshop em uma busca local
antes mesmo de abrir a página.

**Why this priority**: sustenta a aquisição contínua de tráfego e fecha o último passo da
jornada (a visita), mas depende das jornadas anteriores já existirem.

**Independent Test**: validar a seção de contato/localização e o rodapé em mobile e desktop e
auditar estrutura semântica, metadados e dados estruturados de negócio local.

**Acceptance Scenarios**:

1. **Given** a seção de contato, **When** o visitante a lê, **Then** endereço completo,
   telefone, WhatsApp, e-mail, horário de funcionamento por dia e um mapa ou link de rota estão
   visíveis como texto selecionável (não apenas como imagem).
2. **Given** telefone, WhatsApp, e-mail e endereço exibidos, **When** o visitante os aciona no
   mobile, **Then** abrem respectivamente discagem, conversa, cliente de e-mail e aplicativo de
   mapas.
3. **Given** a página carregada, **When** um buscador a rastreia, **Then** há um único `h1`,
   hierarquia de títulos sem saltos, `title` e meta description únicos e descritivos com serviço
   e cidade/bairro, e dados estruturados de negócio local com nome, endereço, telefone, horário
   e área atendida.
4. **Given** o nome, endereço e telefone (NAP), **When** auditados em todas as ocorrências da
   página, **Then** são idênticos entre si e ao Perfil da Empresa no Google.
5. **Given** o rodapé, **When** o visitante o alcança, **Then** encontra identidade, NAP
   completo, horários, canais de contato, atalhos para as seções, redes sociais, razão
   social/CNPJ e link para a política de privacidade.

---

### Edge Cases

- **Fora do horário de funcionamento**: a página indica que o atendimento está fechado e qual é
  o próximo horário, mantendo WhatsApp e formulário disponíveis com expectativa realista de
  retorno, em vez de prometer resposta imediata.
- **WhatsApp indisponível** (desktop sem aplicativo, bloqueio de rede): telefone e formulário
  continuam acessíveis na mesma tela, sem beco sem saída.
- **Prova social insuficiente** (poucas ou nenhuma avaliação real): a seção exibe apenas as
  evidências reais disponíveis (fotos reais, tempo de atuação, responsável técnico) e **não**
  exibe números inventados; sem nenhuma evidência real, a seção não vai ao ar até existir
  conteúdo real.
- **Produto sem preço definido ou fora de estoque**: é apresentado sem preço, com CTA de consulta
  de disponibilidade — nunca com preço desatualizado.
- **Serviço que não atende o caso do animal** (porte, espécie, condição de saúde): a restrição é
  declarada no próprio serviço e nas perguntas frequentes, evitando contato frustrado.
- **Imagem não carrega ou falha de rede**: a seção permanece legível, o layout não quebra e os
  textos alternativos descritivos comunicam o conteúdo.
- **Conexão lenta (3G)**: a primeira tela com proposta, prova e CTA se torna utilizável antes do
  restante da página; nenhum CTA depende de recurso pesado para funcionar.
- **Tela de 360px com textos longos em português**: nenhum rótulo de CTA, título ou card estoura
  o contêiner, e não há rolagem horizontal em nenhum ponto.
- **Navegação apenas por teclado ou por leitor de tela**: todos os CTAs, o formulário e as
  perguntas frequentes são operáveis, com foco visível e ordem lógica.
- **Usuário com `prefers-reduced-motion`**: animações de entrada e carrosséis não se movem
  automaticamente e nenhum conteúdo fica inacessível por isso.
- **Falha no envio do formulário**: o visitante recebe mensagem de erro clara, mantém o que
  digitou e recebe os canais alternativos (WhatsApp e telefone) no próprio erro.
- **Tentativa de spam no formulário**: a proteção antispam não impede o envio legítimo nem exige
  desafio visual inacessível.
- **Tablet em retrato e rotação de tela**: as seções mantêm hierarquia e CTAs visíveis, sem
  sobreposição causada pelo acesso persistente de contato.

---

## Fluxos Principais do Usuário *(mandatory)*

### Fluxo F-1 — Contato imediato (fluxo principal, mais curto possível)

1. Visitante chega pela busca local, por anúncio ou por indicação.
2. Lê a primeira tela: identidade + proposta + prova + localidade + CTA.
3. Aciona o CTA principal de WhatsApp.
4. Conversa abre com mensagem pré-preenchida.
5. Evento de conversão registrado.

**Número de passos até a conversão: 2 interações (abrir a página, acionar o CTA).**

### Fluxo F-2 — Avaliação e agendamento por serviço

1. Visitante chega e rola até a seção de serviços (ou usa a navegação, em no máximo dois toques).
2. Identifica o serviço compatível com o animal dele.
3. Lê escopo, público-alvo, inclusões e duração/faixa de preço.
4. Aciona o CTA daquele serviço (WhatsApp com serviço nomeado) **ou** o formulário de solicitação.
5. Recebe confirmação explícita do envio e a expectativa de retorno.

### Fluxo F-3 — Construção de confiança antes do contato

1. Visitante rola pela seção institucional e pelos diferenciais.
2. Lê a prova social (depoimentos, nota agregada, fonte pública).
3. Confere dados verificáveis (endereço, equipe/responsável, tempo de atuação).
4. Aciona o CTA disponível no ponto de decisão após a prova social.

### Fluxo F-4 — Resolução de dúvidas antes do contato

1. Visitante rola até as perguntas frequentes (ou chega por atalho da navegação).
2. Expande a pergunta correspondente à sua objeção.
3. Lê a resposta e, se a dúvida persistir, aciona o CTA "perguntar pelo WhatsApp".

### Fluxo F-5 — Produtos

1. Visitante rola até produtos em destaque.
2. Identifica categoria/item de interesse.
3. Aciona o CTA de consulta de disponibilidade e preço, com produto nomeado na mensagem.

### Fluxo F-6 — Visita física

1. Visitante rola até a seção de contato/localização (ou usa o atalho da navegação/rodapé).
2. Confere endereço, referência de localização e horário do dia.
3. Aciona o link de rota, que abre o aplicativo de mapas.

---

## Seções Obrigatórias da Home *(mandatory)*

A home é uma página única, em ordem fixa. Cada seção tem um objetivo de negócio declarado
(Princípio I) e um CTA definido.

| ID | Seção | Objetivo de negócio | Ação esperada do usuário |
|----|-------|---------------------|--------------------------|
| S-0 | Cabeçalho e navegação | Orientar e manter o contato a um toque de distância | Usar atalho ou acionar contato |
| S-1 | Seção principal (hero) | Comunicar a proposta, provar valor e converter imediatamente | Acionar CTA principal |
| S-2 | Institucional (sobre o petshop) | Provar que o negócio é real, estabelecido e cuidadoso | Continuar lendo com confiança |
| S-3 | Diferenciais | Responder "por que aqui e não no concorrente" | Reconhecer vantagem concreta |
| S-4 | Serviços | Apresentar a oferta e qualificar o contato por serviço | Acionar CTA do serviço |
| S-5 | Produtos em destaque | Mostrar que há produtos à venda e ampliar o ticket | Consultar disponibilidade |
| S-6 | Prova social / depoimentos | Transferir confiança de clientes reais ao visitante | Acionar CTA após a prova |
| S-7 | Perguntas frequentes | Remover objeções que travam o contato | Resolver dúvida e acionar CTA |
| S-8 | Contato e localização | Fechar a conversão por qualquer canal preferido | Acionar canal ou rota |
| S-9 | Rodapé | Consolidar credibilidade, NAP e conformidade | Confirmar legitimidade / usar atalho |
| S-10 | Acesso persistente de contato (mobile) | Garantir conversão em qualquer ponto da rolagem | Acionar contato a qualquer momento |

### Conteúdo mínimo por seção

**S-0 — Cabeçalho e navegação**
Identidade visual (logotipo + nome), atalhos para Serviços, Produtos, Sobre, Perguntas Frequentes
e Contato, e um CTA de contato. No mobile, navegação compacta sem esconder o CTA.

**S-1 — Seção principal (hero)**
Título com a proposta de valor em uma frase (o que é + para quem + onde), subtítulo com o
benefício concreto, ao menos um elemento de prova (nota e quantidade de avaliações, anos de
atuação ou número de pets atendidos), CTA principal (WhatsApp/agendar) e CTA secundário
(telefone ou "ver serviços"), imagem real do espaço/equipe/animais atendidos, e indicação de
cidade/bairro e situação do horário (aberto/fechado agora).

**S-2 — Institucional**
História e tempo de atuação, a proposta de cuidado, apresentação da equipe ou do responsável,
fotos reais do espaço, e ao menos um dado verificável (endereço, razão social/CNPJ, registro
profissional quando aplicável).

**S-3 — Diferenciais**
De 3 a 6 diferenciais específicos e verificáveis, cada um com título curto, explicação de uma a
duas linhas do benefício para o tutor, e ícone ou imagem de apoio. Proibidos diferenciais
genéricos sem prova.

**S-4 — Serviços**
Lista completa dos serviços oferecidos. Cada serviço: nome, descrição do que é, para quem é
(espécie e porte), o que está incluso, duração estimada e/ou faixa de preço quando aplicável,
restrições relevantes, e CTA próprio com o serviço nomeado na mensagem de contato.

**S-5 — Produtos em destaque**
De 4 a 8 produtos ou categorias reais, cada um com imagem real, nome, descrição curta, e forma
de aquisição (consulta de disponibilidade/preço pelo contato ou compra na loja física). Deixa
explícito se há ou não venda on-line.

**S-6 — Prova social / depoimentos**
De 3 a 6 depoimentos reais com nome (ou primeiro nome e inicial) do cliente e, quando houver,
nome do animal; nota agregada e quantidade total de avaliações, com link para a fonte pública;
quando houver, fotos reais de antes/depois com autorização do tutor. CTA de contato ao final.

**S-7 — Perguntas frequentes**
De 6 a 10 perguntas que cobrem, no mínimo: preço e como é orçado, duração do atendimento,
necessidade de agendamento, atendimento a gatos, pets idosos / ansiosos / de porte grande,
exigência de vacinação, formas de pagamento, política de atraso e cancelamento. Formato
expansível, com CTA final para dúvidas não listadas.

**S-8 — Contato e localização**
Endereço completo com ponto de referência, telefone, WhatsApp, e-mail, horário de funcionamento
por dia da semana, mapa ou link de rota, formulário de solicitação de agendamento com campos
mínimos, e indicação de tempo esperado de resposta. Todos os dados como texto selecionável e
acionável.

**S-9 — Rodapé**
Identidade, NAP completo, horários, todos os canais de contato, atalhos para as seções, redes
sociais, razão social e CNPJ, link para a política de privacidade e aviso de direitos autorais.

**S-10 — Acesso persistente de contato (mobile)**
Acesso fixo ao canal principal de contato, visível em qualquer ponto da rolagem, sem cobrir
conteúdo, controles ou o rodapé, e com alvo de toque de no mínimo 44×44px.

---

## Requirements *(mandatory)*

### Functional Requirements

**Estrutura e navegação**

- **FR-001**: A home MUST apresentar, em uma única página e nesta ordem, as seções S-0 a S-9
  definidas em "Seções Obrigatórias da Home".
- **FR-002**: A navegação MUST permitir alcançar serviços, produtos, institucional, perguntas
  frequentes e contato em no máximo dois toques a partir de qualquer ponto da página.
- **FR-003**: Os atalhos de navegação MUST levar o usuário à seção correspondente com o título
  da seção visível ao final da navegação.
- **FR-004**: A página MUST indicar visualmente a situação do atendimento (aberto ou fechado
  agora) e, quando fechado, o próximo horário de abertura.

**Conversão e contato**

- **FR-005**: A seção principal MUST exibir o CTA principal de contato visível sem rolagem em
  telas de 360px de largura e em desktop.
- **FR-006**: A página MUST repetir um CTA de contato em cada ponto de decisão: ao final de
  serviços, ao final da prova social, ao final das perguntas frequentes e no rodapé.
- **FR-007**: Em telas de mobile, a página MUST oferecer acesso persistente ao canal principal
  de contato em qualquer ponto da rolagem, sem cobrir conteúdo, controles ou o rodapé.
- **FR-008**: Todo link de WhatsApp MUST abrir a conversa com mensagem pré-preenchida contextual
  à seção/item de origem (serviço nomeado, produto nomeado ou intenção geral).
- **FR-009**: Telefone, e-mail e endereço exibidos MUST ser acionáveis, abrindo respectivamente
  discagem, cliente de e-mail e aplicativo de mapas.
- **FR-010**: Cada CTA MUST usar verbo de ação específico (ex.: "Agendar banho e tosa pelo
  WhatsApp"), e dois CTAs de mesma hierarquia MUST NOT competir na mesma área visual.
- **FR-011**: A página MUST oferecer um formulário de solicitação de agendamento contendo apenas
  nome, telefone/WhatsApp, serviço desejado e uma observação opcional, e MUST NOT exigir cadastro,
  login ou criação de conta.
- **FR-012**: O formulário MUST validar as entradas antes do envio, exibir mensagens de erro
  específicas por campo e confirmar explicitamente o envio informando o prazo esperado de retorno.
- **FR-013**: Em caso de falha de envio, o formulário MUST preservar os dados digitados, informar
  o erro em linguagem clara e oferecer WhatsApp e telefone como alternativa imediata.
- **FR-014**: O formulário MUST ter proteção antispam que não exija desafio visual inacessível.
- **FR-015**: Todo acionamento de CTA de contato (WhatsApp, telefone, e-mail, rota, envio de
  formulário) MUST registrar um evento de conversão identificando o canal e a seção de origem.

**Conteúdo das seções**

- **FR-016**: A seção principal MUST conter proposta de valor em uma frase, benefício de apoio,
  ao menos um elemento de prova verificável, indicação de cidade/bairro atendido e CTA principal.
- **FR-017**: A seção institucional MUST conter tempo de atuação, proposta de cuidado,
  apresentação da equipe ou do responsável, imagens reais do espaço e ao menos um dado
  verificável do negócio.
- **FR-018**: A seção de diferenciais MUST apresentar de 3 a 6 diferenciais específicos e
  verificáveis, cada um com benefício explicado para o tutor.
- **FR-019**: Cada serviço MUST declarar nome, o que é, para quem é (espécie e porte), o que
  está incluso, duração estimada e/ou faixa de preço quando aplicável, restrições relevantes e
  CTA próprio.
- **FR-020**: A seção de produtos em destaque MUST apresentar de 4 a 8 produtos ou categorias
  reais com imagem, nome, descrição curta e forma de aquisição, e MUST declarar explicitamente
  se existe venda on-line.
- **FR-021**: A seção de prova social MUST apresentar de 3 a 6 depoimentos reais identificados e,
  quando disponíveis, nota agregada, quantidade de avaliações e link para a fonte pública.
- **FR-022**: A seção de perguntas frequentes MUST conter de 6 a 10 perguntas cobrindo, no
  mínimo: preço/orçamento, duração, necessidade de agendamento, atendimento a gatos, pets
  idosos / ansiosos / de porte grande, exigência de vacinação, formas de pagamento e política de
  atraso e cancelamento.
- **FR-023**: Cada pergunta frequente MUST ser expansível e recolhível por toque e por teclado,
  com o estado expandido/recolhido anunciável por leitor de tela.
- **FR-024**: A seção de contato MUST exibir endereço completo com ponto de referência, telefone,
  WhatsApp, e-mail, horário por dia da semana e mapa ou link de rota, todos como texto
  selecionável.
- **FR-025**: O rodapé MUST conter identidade, NAP completo, horários, canais de contato,
  atalhos para as seções, redes sociais, razão social e CNPJ, e link para a política de
  privacidade.

**Descoberta e SEO local**

- **FR-026**: A página MUST ter um único `h1`, hierarquia de títulos sem saltos de nível e uso
  correto de marcação semântica de cabeçalho, navegação, conteúdo principal, seções e rodapé.
- **FR-027**: A página MUST ter `title` e meta description únicos e descritivos, incluindo
  serviço principal e cidade/bairro.
- **FR-028**: A página MUST incluir dados estruturados de negócio local (petshop) com nome,
  endereço, telefone, horário de funcionamento, coordenadas e área atendida.
- **FR-029**: O NAP (nome, endereço, telefone) MUST ser idêntico em todas as ocorrências da
  página e igual ao do Perfil da Empresa no Google.
- **FR-030**: Toda imagem MUST ter texto alternativo descritivo, e imagens decorativas MUST ser
  marcadas como tal.
- **FR-031**: O site MUST disponibilizar metadados de compartilhamento (Open Graph) com título,
  descrição e imagem representativa do negócio.
- **FR-032**: As perguntas frequentes MUST ser publicadas em formato legível por buscadores
  (conteúdo presente no documento, não carregado apenas sob interação).

**Experiência, acessibilidade e privacidade**

- **FR-033**: A página MUST ser construída a partir de 360px de largura e MUST NOT apresentar
  rolagem horizontal em nenhuma largura entre 360px e 1920px.
- **FR-034**: Alvos de toque MUST ter no mínimo 44×44px e o texto de corpo MUST ter no mínimo
  16px no mobile.
- **FR-035**: Todos os elementos interativos MUST ser operáveis por teclado, com foco visível e
  ordem de foco lógica.
- **FR-036**: O contraste de texto MUST ser de no mínimo 4.5:1 (3:1 para texto grande e
  componentes de interface), e nenhuma informação MUST depender apenas de cor.
- **FR-037**: Animações MUST respeitar `prefers-reduced-motion`, e carrosséis MUST NOT avançar
  automaticamente quando essa preferência estiver ativa.
- **FR-038**: O formulário MUST informar a finalidade da coleta dos dados e a página MUST
  disponibilizar política de privacidade acessível pelo rodapé.
- **FR-039**: Scripts de rastreamento MUST respeitar o consentimento do usuário quando exigido,
  e o registro de conversões MUST NOT bloquear o funcionamento dos CTAs.

### Requisitos de Conteúdo

- **CT-001**: Nenhum texto, imagem ou dado com aparência de placeholder ("Lorem ipsum",
  "Serviço 1", imagem genérica de banco com marca d'água) MUST ser publicado.
- **CT-002**: Todo conteúdo MUST estar em português do Brasil, com tom acolhedor e profissional,
  revisado quanto a ortografia e gramática.
- **CT-003**: Toda afirmação de qualidade MUST ter prova verificável próxima a ela; afirmações
  sem prova MUST ser removidas.
- **CT-004**: Depoimentos, notas, quantidades e selos MUST ser autênticos; dados inventados são
  proibidos.
- **CT-005**: Imagens MUST ser reais do negócio (espaço, equipe, animais atendidos com
  autorização), com tratamento e enquadramento consistentes, sem pixelização ou distorção.
- **CT-006**: Títulos de seção MUST ser orientados a benefício e compreensíveis fora de contexto.
- **CT-007**: Textos de CTA MUST ter no máximo 40 caracteres para não quebrar em telas de 360px.
- **CT-008**: Informação real ainda indisponível MUST ser registrada como pendência explícita na
  seção "Pendências de Conteúdo Real" desta especificação e MUST NOT ir para produção como
  conteúdo provisório.
- **CT-009**: O conteúdo (serviços, produtos, depoimentos, perguntas frequentes, dados de
  contato) MUST ser mantido separado da apresentação, para permitir atualização sem alterar a
  interface.

### Requisitos de Experiência

- **EX-001**: A primeira tela MUST permitir que o visitante responda "o que é, onde é e como
  falo com eles" sem rolar a página.
- **EX-002**: A página MUST ter hierarquia visual que conduza o olhar na ordem: proposta de
  valor → prova → CTA.
- **EX-003**: O mobile MUST ser tratado como experiência principal: toda seção é validada em
  360px e 390px antes de ser considerada concluída.
- **EX-004**: A identidade visual MUST ser moderna e consistente, derivada de um sistema de
  design único (paleta, tipografia, escala de espaçamento, raios, sombras, componentes).
- **EX-005**: Componentes equivalentes MUST ter a mesma aparência e comportamento em todas as
  seções.
- **EX-006**: Elementos decorativos, animações ou efeitos visuais que prejudiquem leitura,
  compreensão, velocidade ou conversão MUST ser removidos.
- **EX-007**: A densidade de informação MUST permitir leitura por varredura: parágrafos curtos,
  listas, títulos descritivos e destaque dos dados que respondem às objeções.
- **EX-008**: A página MUST manter um tom de negócio premium e confiável: sem urgência artificial,
  sem exageros promocionais e sem poluição visual.
- **EX-009**: A primeira tela MUST se tornar utilizável antes do restante da página em conexão
  lenta, e nenhum CTA MUST depender de recurso pesado para funcionar.

### Key Entities

- **Dados do Negócio (NAP)**: nome fantasia, razão social, CNPJ, endereço completo com ponto de
  referência, coordenadas, telefone, WhatsApp, e-mail, redes sociais, área atendida. Fonte única
  reutilizada por todas as seções e pelos dados estruturados.
- **Horário de Funcionamento**: dia da semana, horário de abertura e fechamento, exceções
  (feriados). Determina a indicação "aberto/fechado agora".
- **Serviço**: nome, descrição, espécies e portes atendidos, itens inclusos, duração estimada,
  faixa de preço (opcional), restrições, mensagem de contato pré-preenchida, imagem.
- **Produto em Destaque**: nome, categoria, descrição curta, imagem, indicação de
  disponibilidade, mensagem de contato pré-preenchida. Sem preço quando não confirmado.
- **Diferencial**: título curto, benefício para o tutor, evidência que o sustenta, ícone/imagem.
- **Depoimento / Avaliação**: autor identificado, nome do animal (opcional), texto, nota, data,
  fonte pública (opcional), autorização de uso de imagem quando houver foto.
- **Pergunta Frequente**: pergunta, resposta, objeção que ela resolve, ordem de exibição.
- **Solicitação de Contato/Agendamento**: nome, telefone/WhatsApp, serviço desejado, observação
  opcional, origem (seção/item), data e hora do envio.
- **Evento de Conversão**: canal acionado (WhatsApp, telefone, e-mail, rota, formulário), seção
  de origem, item de origem (serviço/produto), data e hora.

---

## Critérios de Aceitação da Página *(mandatory)*

A entrega só é aceita quando **todos** os critérios abaixo são verificados. Eles complementam os
cenários de aceitação das histórias e os portões do "Fluxo de Desenvolvimento e Portões de
Qualidade" da Constituição.

### Compreensão e proposta

- **AC-001**: Em teste com 5 pessoas que não conhecem o negócio, ao menos 4 descrevem
  corretamente o que o petshop faz e onde fica após 5 segundos de exposição à primeira tela.
- **AC-002**: A primeira tela em 360×640 exibe identidade, proposta, prova, localidade e CTA
  principal sem rolagem.
- **AC-003**: Nenhuma seção depende de outra para ser compreendida.

### Conversão

- **AC-004**: O contato pelo canal principal é concluído em no máximo 2 interações a partir do
  carregamento da página.
- **AC-005**: Todos os CTAs de contato funcionam em mobile e desktop e abrem o canal correto.
- **AC-006**: Toda mensagem de WhatsApp disparada da página chega pré-preenchida e contextual à
  origem.
- **AC-007**: Existe CTA de contato ao final de serviços, da prova social, das perguntas
  frequentes e no rodapé.
- **AC-008**: O acesso persistente de contato no mobile está visível em toda a rolagem e não
  cobre conteúdo, controles ou o rodapé.
- **AC-009**: O formulário envia, valida, confirma e, em falha, oferece canais alternativos sem
  perder os dados digitados.
- **AC-010**: Todos os acionamentos de contato geram evento de conversão identificável por canal
  e seção.

### Conteúdo e credibilidade

- **AC-011**: Nenhum placeholder, texto genérico ou imagem de banco genérica está publicado.
- **AC-012**: Toda afirmação de qualidade tem prova verificável próxima.
- **AC-013**: Todos os depoimentos, notas e números são reais e rastreáveis a uma fonte.
- **AC-014**: As 9 seções obrigatórias existem, na ordem definida, com o conteúdo mínimo de cada
  uma.
- **AC-015**: Serviços declaram espécie/porte atendidos, inclusões e duração ou faixa de preço
  quando aplicável.
- **AC-016**: As perguntas frequentes cobrem as 8 objeções mínimas listadas em FR-022.
- **AC-017**: O NAP é idêntico em todas as ocorrências da página e no Perfil da Empresa no Google.

### Experiência e mobile

- **AC-018**: A página foi validada em 360px, 390px, tablet e desktop sem rolagem horizontal e
  sem quebra de layout.
- **AC-019**: Todos os alvos de toque têm no mínimo 44×44px e o texto de corpo no mobile tem no
  mínimo 16px.
- **AC-020**: Serviços, orçamento/contato, localização e perguntas frequentes são alcançáveis em
  no máximo dois toques.
- **AC-021**: A interface é consistente: componentes equivalentes têm a mesma aparência e
  comportamento em toda a página.

### Acessibilidade

- **AC-022**: Todos os fluxos principais são completáveis apenas com teclado, com foco visível.
- **AC-023**: Contrastes atendem a 4.5:1 (3:1 para texto grande e componentes).
- **AC-024**: Campos do formulário têm rótulo associado e erros anunciáveis por leitor de tela.
- **AC-025**: Com `prefers-reduced-motion` ativo, nenhuma animação automática ocorre e nenhum
  conteúdo fica inacessível.
- **AC-026**: Toda imagem informativa tem texto alternativo descritivo.

### Desempenho e descoberta

- **AC-027**: Em auditoria mobile, LCP ≤ 2,5s, INP ≤ 200ms e CLS ≤ 0,1.
- **AC-028**: Pontuação ≥ 90 em Performance, Acessibilidade, Boas Práticas e SEO em auditoria
  mobile.
- **AC-029**: Há um único `h1`, hierarquia de títulos sem saltos e marcação semântica correta.
- **AC-030**: `title`, meta description, metadados de compartilhamento e dados estruturados de
  negócio local estão presentes e válidos.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um visitante que nunca ouviu falar do negócio descreve corretamente o que o
  petshop faz e onde fica após 5 segundos vendo a primeira tela, em ao menos 80% dos testes.
- **SC-002**: Um visitante no celular inicia o contato pelo canal principal em menos de 10
  segundos a partir do carregamento da página, usando no máximo 2 interações.
- **SC-003**: Ao menos 8% das visitas resultam em um acionamento de contato (WhatsApp, telefone
  ou formulário), medido mensalmente.
- **SC-004**: Ao menos 60% dos contatos recebidos chegam com o serviço de interesse já
  identificado, reduzindo o tempo de atendimento inicial.
- **SC-005**: Ao menos 90% dos visitantes que iniciam o formulário de solicitação o concluem.
- **SC-006**: Ao menos 85% dos visitantes que acionam um CTA de contato o fazem na primeira tela
  ou em um dos pontos de decisão definidos — evidência de que os CTAs estão evidentes.
- **SC-007**: Em teste com 5 tutores, 100% encontram serviços, localização e forma de contato em
  no máximo dois toques, sem ajuda.
- **SC-008**: Em teste com 5 tutores, ao menos 4 declaram que o negócio "parece confiável e bem
  estruturado" após percorrer a página.
- **SC-009**: Taxa de rejeição da home abaixo de 55% e tempo médio de permanência acima de 45
  segundos, medidos mensalmente.
- **SC-010**: A página aparece nos resultados de busca local para o termo "pet shop + [bairro]"
  e "banho e tosa + [bairro]" em até 90 dias após a publicação.
- **SC-011**: Zero ocorrências de conteúdo placeholder, afirmação sem prova ou dado inventado na
  revisão de aceite.
- **SC-012**: Zero ocorrências de rolagem horizontal, CTA cortado ou alvo de toque abaixo de
  44×44px na validação em 360px, 390px, tablet e desktop.
- **SC-013**: Nenhuma pergunta recebida pelos canais de contato repete uma objeção já respondida
  nas perguntas frequentes em mais de 20% dos atendimentos, após o primeiro mês.

---

## Assumptions

- **Escopo**: a entrega é uma **página única** (home comercial). Páginas internas por serviço,
  blog e área de cliente estão fora do escopo desta especificação.
- **Agendamento**: a página entrega **solicitação** de agendamento (WhatsApp com mensagem
  pré-preenchida e formulário), não um sistema de agenda com disponibilidade em tempo real,
  confirmação automática ou pagamento. A confirmação é feita pela equipe do petshop pelo canal
  de contato.
- **Produtos**: a seção de produtos é **vitrine**, não e-commerce. Não há carrinho, checkout,
  cálculo de frete nem estoque em tempo real; a aquisição acontece na loja física ou por contato.
- **Canal principal**: WhatsApp é o canal principal de contato, por ser o padrão de atendimento
  de petshops no Brasil; telefone e formulário são alternativas sempre visíveis.
- **Público e idioma**: público brasileiro, conteúdo exclusivamente em português do Brasil. Não
  há requisito de internacionalização.
- **Acesso predominante**: a maioria do tráfego vem de celular e de busca local, o que justifica
  tratar o mobile como experiência principal.
- **Autenticação**: a página não possui área restrita, login nem cadastro de usuários.
- **Prova social**: as avaliações exibidas vêm de fontes públicas já existentes do negócio
  (ex.: Perfil da Empresa no Google) e/ou de depoimentos coletados com autorização.
- **Mensuração**: existirá uma ferramenta de análise configurada para receber os eventos de
  conversão definidos em FR-015.
- **Imagens**: o petshop fornecerá fotografias reais do espaço, da equipe e dos animais
  atendidos, com autorização de uso de imagem dos tutores quando o animal for identificável.
- **Conformidade**: o formulário coleta apenas dados de contato necessários e a política de
  privacidade será disponibilizada antes da publicação, conforme a LGPD.
- **Testes automatizados**: conforme a Constituição do projeto, a qualidade é garantida por
  validação manual e auditorias; não há testes automatizados nesta especificação.

---

## Pendências de Conteúdo Real

Registro explícito exigido por CT-008 e pelo Princípio VI da Constituição. Nenhum destes itens
pode ir a produção com conteúdo provisório.

| # | Informação pendente | Necessária para |
|---|---------------------|-----------------|
| PC-1 | Nome fantasia, razão social e CNPJ | S-1, S-2, S-9, dados estruturados |
| PC-2 | Endereço completo, ponto de referência e coordenadas | S-1, S-8, S-9, dados estruturados |
| PC-3 | Telefone, número de WhatsApp e e-mail | S-0, S-1, S-8, S-9, S-10 |
| PC-4 | Horário de funcionamento por dia e exceções | S-1, S-8, S-9, FR-004 |
| PC-5 | Tempo de atuação, história e responsáveis/equipe | S-2 |
| PC-6 | Lista real de serviços com inclusões, duração e faixas de preço | S-4 |
| PC-7 | Lista real de produtos em destaque e disponibilidade | S-5 |
| PC-8 | Depoimentos reais autorizados, nota agregada e link da fonte pública | S-6 |
| PC-9 | Diferenciais reais e verificáveis do negócio | S-3 |
| PC-10 | Respostas oficiais às perguntas frequentes (preço, políticas, vacinação) | S-7 |
| PC-11 | Fotografias reais do espaço, equipe e animais, com autorização | S-1, S-2, S-5, S-6 |
| PC-12 | Perfis de redes sociais e política de privacidade | S-9 |
