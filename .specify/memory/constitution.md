<!--
Sync Impact Report
==================
Version change: (template não preenchido) → 1.0.0
Tipo de bump: MAJOR inicial — primeira ratificação da constituição do projeto.

Princípios definidos (substituindo placeholders do template):
- [PRINCIPLE_1_NAME] → I. Objetivo de Negócio em Toda Funcionalidade
- [PRINCIPLE_2_NAME] → II. Confiança Construída com Prova Visível
- [PRINCIPLE_3_NAME] → III. Conversão e CTAs Estratégicos
- [PRINCIPLE_4_NAME] → IV. Mobile-First e Clareza Acima de Estética
- [PRINCIPLE_5_NAME] → V. Design Profissional e Consistente
- Adicionados: VI. Conteúdo Real e Específico
- Adicionados: VII. SEO Local e Estrutura Semântica
- Adicionados: VIII. Acessibilidade como Requisito
- Adicionados: IX. Performance como Qualidade
- Adicionados: X. Código Limpo, Simples e Sustentável

Seções adicionadas:
- Padrões Técnicos e Restrições (antes [SECTION_2_NAME])
- Fluxo de Desenvolvimento e Portões de Qualidade (antes [SECTION_3_NAME])
- Governança (preenchida)

Seções removidas: nenhuma.

Observações de consistência (não alteradas por este comando, que só escreve a constituição):
- ⚠ .specify/templates/plan-template.md, tasks-template.md e spec-template.md podem
  mencionar testes automatizados. Pela Constituição (seção "Padrões Técnicos"), testes
  automatizados NÃO fazem parte do projeto; ao gerar plan/tasks, tarefas de teste
  automatizado DEVEM ser omitidas e substituídas pela validação manual definida aqui.

TODOs pendentes: nenhum.
-->

# Petshop Website Constitution

## Core Principles

### I. Objetivo de Negócio em Toda Funcionalidade

- Toda funcionalidade, seção ou componente MUST declarar, na especificação, qual objetivo de
  negócio atende (ex.: gerar contato, agendar serviço, reforçar confiança, ranquear localmente).
- Funcionalidades sem objetivo de negócio explícito MUST NOT ser especificadas nem implementadas.
- Cada página MUST ter uma ação principal definida (ex.: chamar no WhatsApp, agendar banho e
  tosa, ligar) e todo o conteúdo dela MUST conduzir a essa ação.
- Requisitos MUST ser verificáveis: "melhorar a experiência" não é requisito; "o botão de
  WhatsApp é visível sem rolagem em telas de 360px" é.

**Rationale**: o site é uma ferramenta comercial. O que não gera resultado mensurável é custo de
manutenção e ruído visual que compete com o que gera.

### II. Confiança Construída com Prova Visível

- Confiança MUST NOT ser presumida; ela MUST ser demonstrada com evidências concretas e
  verificáveis: avaliações reais de clientes, fotos reais do espaço, equipe e animais atendidos,
  endereço físico, horário de funcionamento, telefone, CNPJ, tempo de atuação, certificações e
  responsáveis técnicos (ex.: CRMV do veterinário, quando aplicável).
- A primeira tela (acima da dobra) MUST transmitir profissionalismo imediato: identidade clara,
  proposta de valor objetiva, ao menos um elemento de prova (ex.: nota de avaliações,
  anos de mercado) e CTA principal.
- Afirmações de qualidade ("o melhor cuidado", "equipe qualificada") MUST vir acompanhadas de
  prova próxima; afirmações sem prova MUST ser removidas.
- Depoimentos, números e selos MUST ser autênticos. Dados inventados são proibidos.

**Rationale**: tutores confiam o bem-estar de seus animais ao petshop. Sem prova visível, a
decisão de contato não acontece, por mais bonito que o site seja.

### III. Conversão e CTAs Estratégicos

- Os CTAs principais (WhatsApp, telefone, agendamento) MUST estar visíveis sem rolagem na
  primeira tela em mobile e desktop, e MUST reaparecer em pontos de decisão (após serviços,
  após depoimentos, no rodapé).
- No mobile, um acesso persistente ao contato principal (ex.: botão fixo de WhatsApp ou barra
  de ação) MUST existir, sem cobrir conteúdo ou controles.
- CTAs MUST usar verbos de ação específicos ("Agendar banho e tosa pelo WhatsApp"), MUST ter
  contraste e hierarquia que os destaquem e MUST NOT competir entre si na mesma área.
- Formulários MUST pedir apenas os campos estritamente necessários, ter validação clara,
  mensagens de erro úteis e confirmação explícita de envio.
- Links de WhatsApp MUST abrir com mensagem pré-preenchida contextual ao serviço de origem.

**Rationale**: o objetivo final do site é gerar contato. Cada etapa extra ou CTA escondido é
perda direta de clientes.

### IV. Mobile-First e Clareza Acima de Estética

- O design e o código MUST ser construídos primeiro para telas a partir de 360px de largura e
  depois expandidos para telas maiores.
- Toda tela MUST ser validada em mobile antes de ser considerada concluída.
- Alvos de toque MUST ter no mínimo 44×44px; texto de corpo MUST ter no mínimo 16px no mobile;
  nenhuma página MUST apresentar rolagem horizontal.
- Clareza vence estética: se um efeito visual, animação ou elemento decorativo prejudica
  leitura, compreensão, velocidade ou conversão, ele MUST ser removido.
- A navegação MUST permitir que o usuário encontre serviços, preços/orçamento, localização e
  contato em no máximo dois toques.
- Um site bonito, mas lento, confuso ou ruim no mobile, é considerado um fracasso e MUST NOT
  ser entregue.

**Rationale**: a maioria dos tutores pesquisa petshop pelo celular, muitas vezes com urgência.
A experiência mobile é a experiência principal.

### V. Design Profissional e Consistente

- O projeto MUST ter um sistema de design único e documentado: paleta de cores, tipografia,
  escala de espaçamento, raios, sombras e componentes reutilizáveis (botões, cards, seções).
- Valores visuais MUST vir de tokens (variáveis CSS/design tokens); valores "mágicos" avulsos
  no código MUST NOT ser usados.
- Componentes equivalentes MUST ter a mesma aparência e comportamento em todas as páginas.
- Imagens MUST ser de qualidade profissional, consistentes em tratamento e enquadramento;
  imagens pixeladas, distorcidas ou com marca d'água MUST NOT ser publicadas.
- Hierarquia visual MUST guiar o olhar para proposta de valor, prova e CTA, nessa ordem.

**Rationale**: inconsistência visual é percebida como amadorismo e reduz confiança; um sistema
de design também acelera a manutenção.

### VI. Conteúdo Real e Específico

- Conteúdo vago, genérico ou com cara de placeholder (ex.: "Lorem ipsum", "Somos uma empresa
  comprometida com a excelência", "Serviço 1") MUST NOT ser publicado nem aceito como entrega.
- Cada serviço MUST descrever: o que é, para quem é (porte/espécie), o que está incluso,
  duração ou faixa de preço quando aplicável, e como contratar.
- Textos MUST ser escritos em português do Brasil claro, direto, com tom acolhedor e
  profissional, e revisados quanto a ortografia e gramática.
- Quando uma informação real ainda não estiver disponível, a especificação MUST registrá-la
  como pendência explícita; o conteúdo provisório MUST NOT chegar à produção.

**Rationale**: conteúdo genérico não diferencia o negócio, não ranqueia em busca e não
responde às dúvidas que impedem o contato.

### VII. SEO Local e Estrutura Semântica

- Todo HTML MUST ser semântico: um único `h1` por página, hierarquia de títulos sem saltos,
  uso correto de `header`, `nav`, `main`, `section`, `article` e `footer`.
- Cada página MUST ter `title` e `meta description` únicos e descritivos, incluindo serviço e
  cidade/bairro quando pertinente.
- O site MUST incluir dados estruturados (JSON-LD) do tipo `PetStore`/`LocalBusiness` com nome,
  endereço, telefone, horário, coordenadas e área atendida; NAP (nome, endereço, telefone) MUST
  ser idêntico em todo o site e no Perfil da Empresa no Google.
- URLs MUST ser legíveis e descritivas; o site MUST ter `sitemap.xml`, `robots.txt`, URLs
  canônicas e metadados Open Graph para compartilhamento.
- Imagens MUST ter `alt` descritivo e nomes de arquivo significativos.

**Rationale**: clientes de petshop buscam localmente ("pet shop perto de mim", "banho e tosa
em [bairro]"). Sem SEO local, o site não é encontrado por quem está pronto para contratar.

### VIII. Acessibilidade como Requisito

- O site MUST atender às WCAG 2.2 nível AA.
- Contraste de texto MUST ser de no mínimo 4.5:1 (3:1 para texto grande e componentes de
  interface).
- Toda funcionalidade MUST ser operável por teclado, com foco visível e ordem de foco lógica.
- Formulários MUST ter `label` associado a cada campo e mensagens de erro anunciáveis por
  leitores de tela.
- Informação MUST NOT depender apenas de cor; animações MUST respeitar
  `prefers-reduced-motion`.
- Acessibilidade MUST NOT ser tratada como melhoria posterior: uma entrega que viola estes
  critérios não está concluída.

**Rationale**: acessibilidade amplia o público atendido, é exigência legal (Lei Brasileira de
Inclusão) e melhora a usabilidade e o SEO para todos.

### IX. Performance como Qualidade

- Cada página MUST atingir, em mobile, os Core Web Vitals "bons": LCP ≤ 2,5s, INP ≤ 200ms e
  CLS ≤ 0,1, e pontuação Lighthouse ≥ 90 em Performance, Acessibilidade, Boas Práticas e SEO.
- Imagens MUST ser servidas em formatos modernos (AVIF/WebP), redimensionadas para o uso real,
  com dimensões declaradas e carregamento lazy abaixo da dobra.
- Fontes MUST ser limitadas ao necessário, com `font-display: swap` e pré-carregamento das
  críticas.
- Dependências e scripts de terceiros MUST ser justificados; cada um MUST ter benefício de
  negócio maior que seu custo de carregamento.
- Regressões de performance MUST bloquear a entrega.

**Rationale**: lentidão derruba conversão e ranqueamento. Performance é parte da qualidade do
produto, não otimização opcional.

### X. Código Limpo, Simples e Sustentável

- O código MUST seguir princípios de clean code: nomes claros e intencionais, funções e
  componentes pequenos com responsabilidade única, sem duplicação desnecessária e sem código
  morto ou comentado.
- A solução mais simples que atende ao requisito com padrão profissional MUST ser a escolhida
  (YAGNI). Abstrações, bibliotecas e camadas extras MUST ser justificadas por necessidade real.
- Hacks, gambiarras, improvisos, `!important` sem justificativa, estilos inline avulsos e
  soluções temporárias que permanecem MUST NOT ser aceitos.
- A estrutura de pastas MUST ser previsível e organizada por responsabilidade; conteúdo
  (textos, serviços, depoimentos, dados de contato) MUST ficar separado da apresentação para
  permitir atualização sem alterar componentes.
- Formatação e lint MUST ser padronizados e aplicados de forma automática no projeto.

**Rationale**: um site comercial precisa evoluir por anos com custo baixo. Código simples e
organizado é o que permite isso sem regressões.

## Padrões Técnicos e Restrições

- **Testes automatizados**: o projeto NÃO terá testes automatizados (unitários, de integração
  ou end-to-end). Planos e listas de tarefas MUST NOT incluir criação de testes automatizados.
  A qualidade MUST ser garantida pela validação manual e pelas auditorias descritas no
  "Fluxo de Desenvolvimento e Portões de Qualidade".
- **Stack**: a escolha de tecnologia é feita na etapa de planejamento e MUST priorizar
  geração de HTML estático ou pré-renderizado, carregamento rápido, SEO e simplicidade de
  manutenção. Frameworks e dependências MUST ser justificados no plano.
- **Compatibilidade**: o site MUST funcionar nas duas últimas versões de Chrome, Safari
  (incluindo iOS), Firefox, Edge e Samsung Internet.
- **Privacidade e LGPD**: formulários MUST coletar apenas dados necessários e informar a
  finalidade; o site MUST ter política de privacidade; scripts de rastreamento MUST respeitar
  o consentimento do usuário quando exigido.
- **Segurança**: o site MUST ser servido exclusivamente via HTTPS; formulários MUST ter
  proteção contra spam e validação no servidor quando houver back-end; segredos MUST NOT ser
  versionados.
- **Mensuração**: conversões (cliques em WhatsApp, telefone, envio de formulário) MUST ser
  rastreáveis para que o objetivo de negócio de cada funcionalidade possa ser verificado.

## Fluxo de Desenvolvimento e Portões de Qualidade

Uma funcionalidade só é considerada concluída quando passa por todos os portões abaixo:

1. **Especificação**: objetivo de negócio, ação principal e critérios de aceite verificáveis
   documentados (Princípio I).
2. **Conteúdo**: textos e imagens reais aprovados, sem placeholders (Princípio VI).
3. **Validação manual em dispositivos**: revisão em mobile (360px e 390px), tablet e desktop,
   confirmando CTAs visíveis, ausência de rolagem horizontal e fluxos de contato funcionando
   de ponta a ponta (Princípios III e IV).
4. **Auditoria Lighthouse/PageSpeed** em mobile com metas do Princípio IX atingidas.
5. **Revisão de acessibilidade**: navegação por teclado, contraste e verificação com leitor
   de tela nos fluxos principais (Princípio VIII).
6. **Revisão de SEO**: títulos, meta descriptions, dados estruturados e HTML semântico
   validados (Princípio VII).
7. **Revisão de código**: aderência ao Princípio X, sem hacks, código morto ou complexidade
   não justificada; lint e formatação sem erros.

Os planos (`/speckit-plan`) MUST incluir uma verificação de conformidade com esta
constituição ("Constitution Check"), e qualquer violação MUST ser justificada por escrito
com a alternativa mais simples que foi rejeitada e o motivo.

## Governance

- Esta constituição prevalece sobre qualquer outra prática, preferência ou convenção do
  projeto. Em caso de conflito, a constituição vence.
- **Emendas**: alterações MUST ser propostas por escrito com justificativa, impacto sobre
  especificações, planos e tarefas existentes, e plano de migração quando necessário. A emenda
  só entra em vigor após aprovação do responsável pelo projeto e registro neste documento.
- **Versionamento** (semântico):
  - MAJOR: remoção ou redefinição incompatível de princípios ou regras de governança.
  - MINOR: novo princípio ou seção, ou expansão material de orientação existente.
  - PATCH: esclarecimentos, ajustes de redação e correções sem mudança de significado.
- **Conformidade**: toda especificação, plano, lista de tarefas e revisão de entrega MUST
  verificar a aderência aos princípios. Complexidade adicional MUST ser justificada.
  Entregas que violem princípios MUST NOT ser publicadas até a correção ou emenda formal.
- **Revisão periódica**: a constituição MUST ser revisada a cada marco relevante do projeto
  para confirmar que continua refletindo os objetivos do negócio.

**Version**: 1.0.0 | **Ratified**: 2026-10-06 | **Last Amended**: 2026-10-06
