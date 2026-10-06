# Contrato — Endpoint de Solicitação de Contato

**Feature**: Home Page Comercial do Petshop | **Plan**: [../plan.md](../plan.md) | **Decisão**: [research.md R-08](../research.md)

A aplicação é estática e **não** implementa este endpoint. Ela o consome. Este documento é o
contrato que qualquer implementação (função serverless do host, serviço de formulários, backend
próprio futuro) deve cumprir para que o formulário funcione sem alteração no cliente.

O cliente conhece o endpoint apenas por `VITE_CONTACT_ENDPOINT`. Sem essa variável, o adaptador
opera em **modo composer** (ver última seção) e nenhuma requisição HTTP é feita.

---

## Requisição

```http
POST {VITE_CONTACT_ENDPOINT}
Content-Type: application/json
Accept: application/json
```

### Corpo

```json
{
  "name": "Mariana Alves",
  "phone": "+5511987654321",
  "serviceId": "banho-e-tosa",
  "message": "Cadela de porte médio, pelo longo.",
  "origin": { "section": "contact", "item": "banho-e-tosa" },
  "renderedAt": 1791283200000,
  "honeypot": ""
}
```

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `name` | string | sim | 2–80 caracteres após `trim` |
| `phone` | string | sim | E.164 brasileiro: `^\+55\d{10,11}$` (o cliente normaliza a máscara antes de enviar) |
| `serviceId` | string | sim | slug existente no catálogo de serviços |
| `message` | string | não | ≤ 500 caracteres |
| `origin.section` | string | sim | um dos `SectionId` (ver [../data-model.md](../data-model.md)) |
| `origin.item` | string | não | id do serviço ou produto de origem |
| `renderedAt` | number | sim | epoch em ms da montagem do formulário |
| `honeypot` | string | sim | **deve ser string vazia** |

O schema é exatamente `contactRequestSchema` de `src/schemas/contact-request.schema.ts` — a mesma
definição Zod usada na validação do cliente. Compartilhar a definição é o que impede a divergência
clássica entre as duas validações.

### Campos que o endpoint NÃO deve exigir

E-mail, CPF, endereço, nome do animal, raça, consentimento em checkbox. FR-011 determina apenas o
estritamente necessário, e a LGPD reforça a minimização. Exigir qualquer um deles quebra o cliente.

---

## Respostas

### 200 / 201 — Sucesso

```json
{ "ok": true, "requestId": "a1b2c3d4" }
```

`requestId` é opcional e usado apenas para suporte. O cliente ignora qualquer outro campo.

### 400 — Falha de validação

```json
{
  "ok": false,
  "error": "validation",
  "fields": { "phone": "Telefone inválido" }
}
```

O cliente exibe as mensagens de `fields` nos campos correspondentes quando as chaves coincidem com
nomes de campo conhecidos; caso contrário, cai na mensagem genérica de erro.

### 422 — Rejeitado como spam

```json
{ "ok": false, "error": "spam" }
```

O cliente trata como erro genérico e **não** revela ao visitante que foi classificado como spam
(evita ajudar o ajuste de bots). Os dados digitados são preservados e os canais alternativos
aparecem (FR-013).

### 429 — Limite de taxa

```json
{ "ok": false, "error": "rate_limited", "retryAfterSeconds": 60 }
```

O cliente exibe mensagem pedindo para tentar em instantes e oferece WhatsApp e telefone.

### 5xx — Erro do servidor

Qualquer corpo. O cliente trata como erro genérico, preserva os dados e oferece os canais
alternativos.

---

## Obrigações do endpoint (segurança)

Como `VITE_CONTACT_ENDPOINT` vai para o bundle e é **público por definição**, a defesa inteira mora
no servidor. O endpoint **deve**:

1. **Validar o corpo no servidor** com as mesmas regras acima. Nunca confiar na validação do
   cliente.
2. **Rejeitar** quando `honeypot` não for string vazia, respondendo 422.
3. **Rejeitar** quando `Date.now() - renderedAt < 3000` ms, respondendo 422.
4. **Aplicar limite de taxa** por IP (sugestão: 5 requisições / 10 minutos) respondendo 429.
5. **Restringir origem**: aceitar `Origin` apenas do domínio de produção (e do domínio de
   pré-visualização, quando houver). Responder ao preflight `OPTIONS` com
   `Access-Control-Allow-Origin` do domínio exato — **nunca** `*`.
6. **Ser servido exclusivamente por HTTPS.**
7. **Truncar e sanear** `message` antes de qualquer reuso (e-mail, planilha, CRM): escapar o
   conteúdo no destino, nunca interpolar em HTML ou em fórmula de planilha (um `message` começando
   com `=`, `+`, `-` ou `@` deve ser prefixado antes de ir para CSV).
8. **Não ecoar** o corpo recebido na resposta.
9. **Não registrar** o telefone em log de acesso em texto claro; o dado pessoal fica apenas no
   destino de atendimento.
10. **Reter** a solicitação apenas pelo tempo necessário ao atendimento comercial, conforme a
    política de privacidade publicada (LGPD).
11. **Responder em menos de 10 segundos** — o cliente aborta em 10s e trata como erro genérico.

---

## Comportamento do cliente

Implementado em `src/lib/contact/submit.ts`:

```text
submitContactRequest(request: ContactRequest): Promise<SubmitResult>

SubmitResult =
  | { status: 'success' }
  | { status: 'field-errors'; fields: Record<string, string> }
  | { status: 'error'; retryAfterSeconds?: number }
```

| Comportamento | Regra |
|---|---|
| Tempo limite | `AbortController` com 10s ⇒ `{ status: 'error' }` |
| Nova tentativa automática | **Nenhuma** — evita duplicar a solicitação; o visitante reenvia |
| Dados em falha | Sempre preservados no formulário (FR-013) |
| Evento de conversão | `trackConversion({ channel: 'form', ... })` disparado **somente** em `success` |
| Credenciais | `credentials: 'omit'` — nenhum cookie é enviado |
| Cabeçalhos | Apenas `Content-Type` e `Accept`; nenhum cabeçalho de identificação do usuário |

---

## Modo composer (padrão, sem endpoint)

Sem `VITE_CONTACT_ENDPOINT`, o adaptador não faz requisição: valida com o mesmo schema, monta a
mensagem a partir dos campos e abre o WhatsApp via `buildWhatsAppUrl({ kind: 'form-fallback', request })`.

```text
Olá! Gostaria de agendar: {nome do serviço}
Nome: {name}
Telefone: {phone formatado}
Observação: {message}
```

**Por que isso não é um placeholder**: o WhatsApp é o canal principal declarado na especificação, a
mensagem chega estruturada e qualificada, e a conversão é registrada com
`channel: 'form'`. A diferença operacional é que a solicitação chega como conversa em vez de
registro — o que é exatamente como petshops atendem hoje.

**Diferenças visíveis para o visitante** neste modo: o botão diz "Enviar pelo WhatsApp" e o texto de
finalidade da coleta informa que a mensagem será aberta no WhatsApp. Nenhuma outra mudança de
layout, para que a troca de modo não altere o design.

**Troca entre os modos**: definir `VITE_CONTACT_ENDPOINT` e reconstruir. Nenhuma alteração de
componente.
