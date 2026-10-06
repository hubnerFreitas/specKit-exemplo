import type { Differential } from '@/types/content';

/* ============================================================================
   Diferenciais (S-3) — de 3 a 6 itens (FR-018).

   O campo `evidence` é obrigatório no schema: é o que impede o diferencial
   genérico. Cada item abaixo é verificável por quem visita a loja.

   PENDÊNCIA: PC-9 (confirmar cada diferencial com o estabelecimento).
   ============================================================================ */

export const differentials: Differential[] = [
  {
    id: 'sem-gaiola-de-secagem',
    title: 'Secagem sem gaiola',
    description:
      'Nenhum animal é colocado em gaiola de secagem automática. A secagem é feita com secador de mão, por uma pessoa, do começo ao fim.',
    evidence: 'Não há gaiola de secagem no espaço — você pode conferir na visita.',
    icon: 'Wind',
  },
  {
    id: 'acompanhamento-individual',
    title: 'Uma pessoa por pet',
    description:
      'O mesmo profissional acompanha seu animal do banho à entrega, então ninguém precisa reaprender o jeito dele a cada visita.',
    evidence: 'Agenda limitada a 4 pets por profissional por turno.',
    icon: 'UserCheck',
  },
  {
    id: 'veterinaria-na-casa',
    title: 'Veterinária na casa',
    description:
      'Consultório próprio no mesmo endereço. Se algo aparecer durante o banho — uma ferida, um carrapato, uma alteração de pele — é avaliado na hora.',
    evidence: 'Dra. Carolina Esteves, CRMV-SP 29.184, de terça a sábado.',
    icon: 'Stethoscope',
  },
  {
    id: 'atendimento-felino',
    title: 'Atendimento separado para gatos',
    description:
      'Gatos têm horário exclusivo pela manhã, em sala isolada do movimento dos cães, para reduzir o estresse do ambiente.',
    evidence: 'Terças e quintas, das 8h às 11h, sem cães no espaço.',
    icon: 'Cat',
  },
  {
    id: 'foto-ao-final',
    title: 'Foto e relato ao final',
    description:
      'Você recebe no WhatsApp uma foto do seu pet pronto e um resumo do que foi observado durante o atendimento.',
    evidence: 'Enviado em todos os atendimentos, antes da retirada.',
    icon: 'Camera',
  },
  {
    id: 'leva-e-traz',
    title: 'Leva e traz no bairro',
    description:
      'Buscamos e devolvemos seu pet em casa, em veículo próprio com caixa de transporte fixada, dentro da Vila Mariana e bairros vizinhos.',
    evidence: 'Veículo próprio, raio de 3 km, com taxa fixa informada no agendamento.',
    icon: 'Car',
  },
];
