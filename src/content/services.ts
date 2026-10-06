import consultaPicture from '@/assets/images/servico-consulta.jpg?w=320;640;960&format=avif;webp;jpg&as=picture';
import banhoTosaPicture from '@/assets/images/servico-banho-tosa.jpg?w=320;640;960&format=avif;webp;jpg&as=picture';
import higienicaPicture from '@/assets/images/servico-tosa-higienica.jpg?w=320;640;960&format=avif;webp;jpg&as=picture';
import hidratacaoPicture from '@/assets/images/servico-hidratacao.jpg?w=320;640;960&format=avif;webp;jpg&as=picture';
import vacinacaoPicture from '@/assets/images/servico-vacinacao.jpg?w=320;640;960&format=avif;webp;jpg&as=picture';
import levaTrazPicture from '@/assets/images/servico-leva-traz.jpg?w=320;640;960&format=avif;webp;jpg&as=picture';
import type { Service } from '@/types/content';

/* ============================================================================
   Serviços (S-4).
   Cada serviço declara espécie e porte atendidos, o que está incluso, duração
   e/ou faixa de preço, e restrições relevantes (FR-019 / AC-015).
   `cta.intent` é sempre `service:<id>` — validado no build.

   PENDÊNCIA: PC-6 (confirmar inclusões, durações e faixas de preço reais).
   ============================================================================ */

export const services: Service[] = [
  {
    id: 'banho-e-tosa',
    name: 'Banho e tosa completa',
    summary:
      'Banho, secagem acompanhada e tosa na máquina ou na tesoura, no padrão da raça ou no comprimento que você preferir.',
    species: ['dog', 'cat'],
    sizes: ['small', 'medium', 'large', 'giant'],
    includes: [
      'Banho com shampoo adequado ao tipo de pelo',
      'Secagem com secador de mão, sem gaiola',
      'Tosa na máquina ou na tesoura',
      'Corte de unhas e limpeza de ouvidos',
      'Escovação de pelo e perfume',
      'Foto e relato no WhatsApp ao final',
    ],
    durationMinutes: { min: 90, max: 180 },
    priceRange: { min: 85, max: 240, currency: 'BRL' },
    restrictions: [
      'Tosa na tesoura exige agendamento com 3 dias de antecedência',
      'Carteira de vacinação em dia é obrigatória',
    ],
    cta: { label: 'Agendar banho e tosa', channel: 'whatsapp', intent: 'service:banho-e-tosa' },
    image: {
      source: banhoTosaPicture,
      alt: 'Cão de pelo longo sendo tosado na tesoura sobre bancada de atendimento',
      width: 1000,
      height: 750,
      mediaConsent: true,
    },
  },
  {
    id: 'tosa-higienica',
    name: 'Banho com tosa higiênica',
    summary:
      'Banho completo com aparo apenas nas áreas íntimas, patas e face. Indicado para quem mantém o pelo longo.',
    species: ['dog', 'cat'],
    sizes: ['small', 'medium', 'large', 'giant'],
    includes: [
      'Banho com shampoo adequado ao tipo de pelo',
      'Secagem com secador de mão, sem gaiola',
      'Aparo higiênico de patas, face e áreas íntimas',
      'Corte de unhas e limpeza de ouvidos',
    ],
    durationMinutes: { min: 60, max: 120 },
    priceRange: { min: 65, max: 170, currency: 'BRL' },
    restrictions: ['Carteira de vacinação em dia é obrigatória'],
    cta: { label: 'Agendar tosa higiênica', channel: 'whatsapp', intent: 'service:tosa-higienica' },
    image: {
      source: higienicaPicture,
      alt: 'Profissional fazendo aparo higiênico nas patas de um cão de porte pequeno',
      width: 1000,
      height: 750,
      mediaConsent: true,
    },
  },
  {
    id: 'hidratacao-e-tratamentos',
    name: 'Hidratação e tratamento de pelo',
    summary:
      'Banho com máscara de hidratação profunda para pelos ressecados, opacos ou com queda excessiva. Pode ser combinado com tosa.',
    species: ['dog', 'cat'],
    sizes: ['small', 'medium', 'large', 'giant'],
    includes: [
      'Banho com shampoo específico para o diagnóstico do pelo',
      'Máscara de hidratação com tempo de ação',
      'Secagem e escovação alinhada',
      'Orientação de manutenção em casa',
    ],
    durationMinutes: { min: 100, max: 160 },
    priceRange: { min: 120, max: 290, currency: 'BRL' },
    restrictions: ['Pelos com nós severos podem exigir tosa antes da hidratação'],
    cta: {
      label: 'Agendar hidratação',
      channel: 'whatsapp',
      intent: 'service:hidratacao-e-tratamentos',
    },
    image: {
      source: hidratacaoPicture,
      alt: 'Aplicação de máscara de hidratação no pelo de um cão durante o banho',
      width: 1000,
      height: 750,
      mediaConsent: true,
    },
  },
  {
    id: 'consulta-veterinaria',
    name: 'Consulta veterinária',
    summary:
      'Avaliação clínica no consultório próprio, com a veterinária responsável. Indicado para check-up, dermatologia e acompanhamento de pets idosos.',
    species: ['dog', 'cat'],
    sizes: ['small', 'medium', 'large', 'giant'],
    includes: [
      'Anamnese completa com o tutor',
      'Exame clínico geral',
      'Prescrição e orientação por escrito',
      'Encaminhamento para exames quando necessário',
    ],
    durationMinutes: { min: 30, max: 50 },
    priceRange: { min: 180, max: 180, currency: 'BRL' },
    restrictions: [
      'Atendimento de terça a sábado, com agendamento prévio',
      'Não realizamos atendimento de emergência nem internação',
    ],
    cta: {
      label: 'Marcar consulta',
      channel: 'whatsapp',
      intent: 'service:consulta-veterinaria',
    },
    image: {
      source: consultaPicture,
      alt: 'Médica-veterinária examinando um gato sobre a mesa do consultório',
      width: 1000,
      height: 750,
      mediaConsent: true,
    },
  },
  {
    id: 'vacinacao',
    name: 'Vacinação e vermifugação',
    summary:
      'Aplicação de vacinas com registro em carteira e controle de reforços, feita pela veterinária responsável.',
    species: ['dog', 'cat'],
    sizes: ['small', 'medium', 'large', 'giant'],
    includes: [
      'Avaliação prévia de aptidão para a vacina',
      'Aplicação e registro na carteira de vacinação',
      'Lembrete de reforço pelo WhatsApp',
    ],
    durationMinutes: { min: 20, max: 30 },
    priceRange: { min: 90, max: 220, currency: 'BRL' },
    restrictions: [
      'Animais com febre ou em tratamento não são vacinados no dia',
      'Filhotes exigem protocolo de três doses',
    ],
    cta: { label: 'Agendar vacinação', channel: 'whatsapp', intent: 'service:vacinacao' },
    image: {
      source: vacinacaoPicture,
      alt: 'Veterinária preparando a aplicação de vacina em um cão filhote',
      width: 1000,
      height: 750,
      mediaConsent: true,
    },
  },
  {
    id: 'leva-e-traz',
    name: 'Leva e traz',
    summary:
      'Buscamos e devolvemos seu pet em casa, em veículo próprio com caixa de transporte fixada. Pode ser somado a qualquer serviço.',
    species: ['dog', 'cat'],
    sizes: ['small', 'medium', 'large'],
    includes: [
      'Busca e devolução no endereço informado',
      'Veículo próprio com caixa de transporte fixada',
      'Aviso de saída e de chegada pelo WhatsApp',
    ],
    durationMinutes: { min: 20, max: 40 },
    priceRange: { min: 25, max: 45, currency: 'BRL' },
    restrictions: [
      'Disponível em um raio de 3 km da loja',
      'Não atendemos cães de porte gigante no transporte',
    ],
    cta: { label: 'Consultar leva e traz', channel: 'whatsapp', intent: 'service:leva-e-traz' },
    image: {
      source: levaTrazPicture,
      alt: 'Veículo do Patas Felizes com caixa de transporte fixada no interior',
      width: 1000,
      height: 750,
    },
  },
];
