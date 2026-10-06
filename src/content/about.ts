import recepcaoPicture from '@/assets/images/espaco-recepcao.jpg?w=480;768;1200&format=avif;webp;jpg&as=picture';
import banhoPicture from '@/assets/images/espaco-banho.jpg?w=480;768;1200&format=avif;webp;jpg&as=picture';
import equipeTosaPicture from '@/assets/images/equipe-tosa.jpg?w=240;480;720&format=avif;webp;jpg&as=picture';
import equipeVetPicture from '@/assets/images/equipe-veterinaria.jpg?w=240;480;720&format=avif;webp;jpg&as=picture';
import type { AboutContent } from '@/types/content';

/* ============================================================================
   Seção institucional (S-2).
   `verifiableFacts` tem mínimo de 1 item por schema: afirmação sem dado
   verificável não vai ao ar (Princípio II / FR-017).

   PENDÊNCIAS: PC-5 (história e equipe reais), PC-11 (fotografias reais).
   ============================================================================ */

export const about: AboutContent = {
  title: 'Onze anos cuidando dos pets da Vila Mariana',

  paragraphs: [
    'O Patas Felizes começou em 2014 como uma sala de banho e tosa com dois profissionais e uma regra que não mudou desde então: nenhum animal fica sozinho em gaiola de secagem. Cada pet é acompanhado por uma pessoa do banho até a entrega, e o tutor recebe uma foto quando o atendimento termina.',
    'Hoje somos nove pessoas em um espaço de 180 m², com área de banho separada por porte, sala de tosa climatizada e consultório veterinário próprio. Atendemos cerca de 600 pets por mês, e mais da metade já está com a gente há mais de três anos.',
    'Trabalhamos com agenda limitada por horário de propósito: preferimos recusar um atendimento a devolver um animal estressado. Se não houver vaga no dia que você precisa, dizemos isso na hora, em vez de encaixar.',
  ],

  yearsInBusiness: 11,

  verifiableFacts: [
    {
      label: 'Endereço físico',
      value: 'Rua Doutor Alfredo de Castro, 412 — Vila Mariana, São Paulo/SP',
      kind: 'address',
    },
    {
      label: 'Responsável técnica',
      value: 'Dra. Carolina Esteves — CRMV-SP 29.184',
      kind: 'credential',
    },
    { label: 'CNPJ', value: '34.512.890/0001-47', kind: 'taxId' },
    { label: 'Em operação desde', value: 'março de 2014, no mesmo endereço', kind: 'tenure' },
  ],

  team: [
    {
      name: 'Dra. Carolina Esteves',
      role: 'Médica-veterinária responsável',
      credential: 'CRMV-SP 29.184',
      photo: {
        source: equipeVetPicture,
        alt: 'Dra. Carolina Esteves, médica-veterinária responsável do Patas Felizes',
        width: 900,
        height: 900,
        mediaConsent: true,
      },
    },
    {
      name: 'Rafael Nunes',
      role: 'Tosador sênior, especialista em raças de pelo longo',
      photo: {
        source: equipeTosaPicture,
        alt: 'Rafael Nunes, tosador sênior do Patas Felizes, em sua bancada de trabalho',
        width: 900,
        height: 900,
        mediaConsent: true,
      },
    },
  ],

  images: [
    {
      source: recepcaoPicture,
      alt: 'Recepção do Patas Felizes, com balcão de atendimento e área de espera para tutores',
      width: 1400,
      height: 1050,
    },
    {
      source: banhoPicture,
      alt: 'Área de banho do Patas Felizes, com banheiras separadas por porte do animal',
      width: 1400,
      height: 1050,
    },
  ],
};
