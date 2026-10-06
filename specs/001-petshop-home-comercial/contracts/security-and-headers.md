# Contrato — Segurança, Cabeçalhos HTTP e Privacidade

**Feature**: Home Page Comercial do Petshop | **Plan**: [../plan.md](../plan.md) | **Decisão**: [research.md R-10](../research.md)

A página não tem autenticação, sessão nem armazenamento de dados pessoais. A superfície real de
segurança é composta por três frentes, e este contrato cobre as três:

1. **Integridade do que é servido** → cabeçalhos HTTP e CSP.
2. **O trajeto do dado do formulário** → [contact-endpoint.md](./contact-endpoint.md).
3. **A cadeia de dependências** → versões exatas, lockfile e auditoria.

---

## Cabeçalhos HTTP obrigatórios

Configurados no host (arquivo `public/_headers` para hosts que o suportam, ou configuração
equivalente). Cabeçalho não é opcional: sem ele, a CSP em `<meta>` não cobre `frame-ancestors` nem
relatórios.

```text
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' <VITE_CONTACT_ENDPOINT>; frame-src https://www.google.com; form-action 'self' <VITE_CONTACT_ENDPOINT>; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  X-Frame-Options: DENY
```

| Cabeçalho | Por que neste projeto |
|---|---|
| `CSP` sem `'unsafe-inline'` em `script-src` | Viável porque nenhum script inline é usado. O JSON-LD usa `type="application/ld+json"`, que a CSP não trata como script executável. Essa é a razão de evitar bibliotecas que injetam script inline |
| `HSTS` | Constituição exige HTTPS exclusivo |
| `frame-ancestors 'none'` + `X-Frame-Options` | Impede que a página seja embutida em site de terceiro simulando o negócio |
| `form-action` restrito | Impede que uma injeção redirecione o envio do formulário para outro destino |
| `base-uri 'none'` | Impede reescrita de todos os links relativos por injeção de `<base>` |
| `Permissions-Policy` | A página não precisa de nenhuma dessas permissões; negar reduz a superfície e melhora Boas Práticas no Lighthouse |
| `connect-src` restrito | Única conexão de saída legítima é o endpoint do formulário |

**Se a análise usar provedor de terceiro**: `script-src` e `connect-src` recebem o domínio
**específico** do provedor. `'unsafe-inline'` permanece proibido — se o provedor exigir script
inline, ele é incompatível com este projeto.

### CSP também em `<meta>`

Uma `<meta http-equiv="Content-Security-Policy">` equivalente (sem as diretivas que só funcionam em
cabeçalho) é incluída no `index.html` como defesa em profundidade, para o caso de uma configuração
de host ser perdida em uma migração.

---

## Regras de código

| Regra | Verificação |
|---|---|
| `dangerouslySetInnerHTML` proibido, **exceto** no bloco JSON-LD construído com `JSON.stringify` sobre dados tipados | Revisão de código; busca por ocorrências antes de cada entrega |
| Todo `target="_blank"` acompanhado de `rel="noopener noreferrer"` | `CtaButton`/`ContactLink` encapsulam; `eslint-plugin-react` sinaliza o resto |
| Nenhum conteúdo de usuário é renderizado na página | Estrutural: não há comentários, busca nem área de cliente |
| `href` nunca vem de dado não validado | URLs externas só de `business.socials[].url` e `testimonials[].sourceUrl`, ambas validadas como URL HTTPS pelo Zod |
| `iframe` do mapa com `sandbox`, `loading="lazy"`, `referrerpolicy="no-referrer"`, montado só após clique | `MapEmbed` (R-12) |
| Nenhum uso de `eval`, `new Function`, `innerHTML` | CSP já bloqueia; revisão confirma |
| Nenhum acesso a `window`/`document` fora de `useEffect` | Exigência do prerender; também evita erro de execução no build |

---

## Segredos e variáveis de ambiente

**Regra fundamental**: todo `import.meta.env.VITE_*` é compilado no bundle e é **público**. Não
existe segredo no cliente.

`.env.example` (versionado, com comentário explícito):

```text
# ATENÇÃO: toda variável VITE_* é pública e vai para o bundle do navegador.
# Nunca coloque chave de API, token ou credencial aqui.

# URL do endpoint que recebe a solicitação de contato.
# Vazio = modo composer (abre o WhatsApp com a mensagem). Ver contracts/contact-endpoint.md
VITE_CONTACT_ENDPOINT=

# Domínio canônico usado em canonical, Open Graph e JSON-LD.
VITE_SITE_URL=https://exemplo.com.br
```

- `.env`, `.env.local`, `.env.production` no `.gitignore`.
- Nenhuma chave de API no repositório, em nenhuma circunstância.
- Se uma integração futura exigir segredo, ele vive no endpoint serverless, nunca no cliente.

---

## Cadeia de dependências

| Prática | Motivo |
|---|---|
| Versões **exatas** no `package.json` (sem `^` nem `~`) | Build reprodutível; impede que uma versão comprometida entre sem revisão |
| `package-lock.json` versionado | Mesma árvore em qualquer máquina e no host |
| `npm ci` no build de produção (nunca `npm install`) | Respeita o lockfile estritamente |
| `npm audit --omit=dev` no portão de qualidade; vulnerabilidade alta ou crítica bloqueia a entrega | Princípio IX/X: regressão de segurança é defeito, não pendência |
| Toda dependência nova exige justificativa escrita de benefício de negócio versus custo | Constituição, "Padrões Técnicos" |
| Atualizações revisadas manualmente, com nova auditoria antes de publicar | Evita atualização automática introduzir regressão de performance ou de comportamento |

**Dependências de produção deliberadamente ausentes**: roteador, biblioteca de estado, biblioteca
de animação, biblioteca de carrossel, biblioteca de data, SDK de análise, biblioteca de ícones por
barril. Cada ausência é superfície de ataque e peso que não existem.

---

## Privacidade e LGPD

| Requisito | Implementação |
|---|---|
| Finalidade declarada na coleta | Texto junto ao botão de envio do formulário (FR-038) |
| Minimização de dados | 4 campos; e-mail, CPF e endereço deliberadamente ausentes ([../data-model.md](../data-model.md)) |
| Política de privacidade acessível | Link no rodapé (FR-025, FR-038) |
| Consentimento para rastreamento | Nenhum script de terceiro, cookie ou `localStorage` antes do consentimento ([analytics-events.md](./analytics-events.md)) |
| Sem transferência involuntária a terceiros | Fontes auto-hospedadas; mapa só após clique; imagens no próprio domínio |
| Dado pessoal fora da análise | Eventos de conversão não carregam nome, telefone nem mensagem |
| Imagem de pessoas e animais identificáveis | Campo `mediaConsent` obrigatório no `ImageAsset` |
| Retenção | Definida pelo endpoint, conforme a política publicada |

**Nenhum dado pessoal é armazenado no navegador.** A aplicação não usa cookies próprios,
`localStorage` nem `sessionStorage`.

---

## Portão de verificação de segurança

Itens obrigatórios antes de cada publicação:

- [ ] Site acessível **somente** por HTTPS; HTTP redireciona
- [ ] Todos os cabeçalhos da tabela presentes na resposta de produção (conferir com
      `curl -I` ou com a aba de rede)
- [ ] CSP sem violação no console em um percurso completo da página
- [ ] CSP sem `'unsafe-inline'` e sem `'unsafe-eval'` em `script-src`
- [ ] `npm audit --omit=dev` sem vulnerabilidade alta ou crítica
- [ ] `package-lock.json` versionado e coerente com o `package.json`
- [ ] Nenhum `.env` no repositório; `git log` sem segredo em histórico
- [ ] Nenhuma ocorrência de `dangerouslySetInnerHTML` fora do bloco JSON-LD
- [ ] Todo `target="_blank"` com `rel="noopener noreferrer"`
- [ ] Endpoint do formulário validando no servidor, com limite de taxa e origem restrita
- [ ] Nenhuma requisição a domínio de terceiro no carregamento inicial (conferir na aba de rede)
- [ ] Política de privacidade publicada e alcançável pelo rodapé
