import type { FaqItem } from '@/types/content';

/* ============================================================================
   Perguntas frequentes (S-7) — de 6 a 10 itens (FR-022).

   Os 8 tópicos abaixo são OBRIGATÓRIOS e verificados no build por
   scripts/validate-content.ts (AC-016): pricing, duration, scheduling, cats,
   special-pets, vaccination, payment e cancellation.

   PENDÊNCIA: PC-10 (confirmar as respostas oficiais com o estabelecimento,
   em especial preços, políticas e exigência de vacinação).
   ============================================================================ */

export const faq: FaqItem[] = [
  {
    id: 'faq-preco',
    order: 0,
    topic: 'pricing',
    question: 'Quanto custa o banho e tosa?',
    answer:
      'O preço varia pelo porte e pelo tipo de pelo do animal: o banho e tosa completa fica entre R$ 85 e R$ 240. Para dar o valor exato precisamos saber a raça, o porte e como está o pelo — por isso pedimos essas informações no WhatsApp antes de confirmar. Não trabalhamos com taxa surpresa: o valor é fechado no agendamento e não muda na retirada.',
  },
  {
    id: 'faq-duracao',
    order: 1,
    topic: 'duration',
    question: 'Quanto tempo meu pet fica no petshop?',
    answer:
      'Entre 1h30 e 3h, dependendo do porte e do serviço. Tosa na tesoura e hidratação levam mais tempo. Não deixamos animal esperando além do necessário: o horário é marcado para que ele entre, seja atendido e saia. Se você precisa de um tempo mais curto, avise no agendamento que ajustamos a agenda.',
  },
  {
    id: 'faq-agendamento',
    order: 2,
    topic: 'scheduling',
    question: 'Preciso agendar ou posso chegar na hora?',
    answer:
      'É necessário agendar. Limitamos a agenda a 4 pets por profissional por turno justamente para que cada animal seja acompanhado individualmente, então não temos como atender por ordem de chegada. Sábados costumam fechar com uma semana de antecedência. Agende pelo WhatsApp e confirmamos o horário na mesma conversa.',
  },
  {
    id: 'faq-gatos',
    order: 3,
    topic: 'cats',
    question: 'Vocês atendem gatos?',
    answer:
      'Sim, com horário exclusivo: terças e quintas, das 8h às 11h, em sala isolada e sem nenhum cão no espaço. Fazemos banho, tosa higiênica, hidratação, consulta e vacinação para gatos. Trabalhamos sem contenção química: se o gato não se sentir confortável, interrompemos o atendimento e conversamos com você sobre as alternativas.',
  },
  {
    id: 'faq-pets-especiais',
    order: 4,
    topic: 'special-pets',
    question: 'Meu pet é idoso, ansioso ou de porte grande. Vocês atendem?',
    answer:
      'Atendemos os três casos. Pets idosos e ansiosos são agendados em horários de menor movimento e passam por uma avaliação rápida da veterinária antes do banho. Cães de porte grande e gigante têm banheira e espaço próprios. Não usamos sedação nem contenção forçada: se o animal não estiver bem, paramos o atendimento e avisamos você imediatamente.',
  },
  {
    id: 'faq-vacinacao',
    order: 5,
    topic: 'vaccination',
    question: 'Preciso apresentar a carteira de vacinação?',
    answer:
      'Sim, a carteira de vacinação em dia é obrigatória para banho, tosa e qualquer serviço no espaço — inclusive para gatos. Isso protege o seu animal e os outros que circulam aqui. Se a vacina estiver atrasada, podemos aplicá-la na própria visita com a veterinária responsável e reagendar o banho conforme o protocolo da vacina.',
  },
  {
    id: 'faq-pagamento',
    order: 6,
    topic: 'payment',
    question: 'Quais formas de pagamento vocês aceitam?',
    answer:
      'Aceitamos Pix, dinheiro, cartão de débito e cartão de crédito em até 3 vezes sem juros acima de R$ 300. O pagamento é feito na retirada, no balcão, e você recebe a nota fiscal por e-mail. Para clientes recorrentes oferecemos pacote mensal de banhos com desconto — pergunte no WhatsApp.',
  },
  {
    id: 'faq-cancelamento',
    order: 7,
    topic: 'cancellation',
    question: 'Como funcionam atrasos e cancelamentos?',
    answer:
      'Cancelamentos até 4 horas antes do horário não têm nenhum custo. Atrasos de até 20 minutos são absorvidos na agenda; acima disso, pode ser necessário remarcar, porque o horário seguinte já está reservado para outro animal. Se faltar sem avisar duas vezes seguidas, passamos a pedir confirmação no dia anterior.',
  },
  {
    id: 'faq-leva-e-traz',
    order: 8,
    topic: 'other',
    question: 'Vocês buscam e levam o pet em casa?',
    answer:
      'Sim, dentro de um raio de 3 km da loja, que cobre Vila Mariana, Paraíso, Ana Rosa, Chácara Klabin e parte do Ipiranga e da Saúde. O transporte é em veículo próprio, com caixa fixada, e você recebe aviso de saída e de chegada pelo WhatsApp. A taxa é fixa, entre R$ 25 e R$ 45, informada no agendamento. Não transportamos cães de porte gigante.',
  },
  {
    id: 'faq-emergencia',
    order: 9,
    topic: 'other',
    question: 'Vocês atendem emergências veterinárias?',
    answer:
      'Não. Nosso consultório funciona por agendamento, de terça a sábado, e não temos estrutura de pronto-socorro nem internação. Em caso de emergência, procure um hospital veterinário 24 horas. Se a urgência aparecer durante um atendimento nosso, estabilizamos o que for possível, avisamos você na hora e indicamos para onde levar.',
  },
];
