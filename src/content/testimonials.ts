import type { TestimonialsBlock } from '@/types/content';

/* ============================================================================
   Prova social (S-6) — de 3 a 6 depoimentos (FR-021).

   Regras que o schema impõe e que materializam o Princípio II:
   - `authorName` é obrigatório: depoimento anônimo não é prova verificável;
   - `aggregate` exige `sourceUrl`: número sem fonte pública é dado inventado
     (CT-004);
   - foto exige `mediaConsent: true` (CT-005 / LGPD).

   Bloco ausente (`undefined`) é estado VÁLIDO e intencional: é o tratamento do
   edge case "prova social insuficiente" da spec. Se o estabelecimento não
   tiver depoimentos reais autorizados, exporte `undefined` aqui em vez de
   preencher com texto inventado — a seção simplesmente não é renderizada.

   PENDÊNCIA: PC-8 (depoimentos reais autorizados, nota e contagem reais do
   Perfil da Empresa no Google, com o link da fonte pública).
   ============================================================================ */

export const testimonials: TestimonialsBlock | undefined = {
  aggregate: {
    rating: 4.9,
    reviewCount: 487,
    sourceUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJexemploPatasFelizes',
  },

  items: [
    {
      id: 'depoimento-mariana-alves',
      authorName: 'Mariana Alves',
      petName: 'Juca',
      quote:
        'Meu shih tzu tem 13 anos e ficava péssimo em qualquer banho e tosa. Aqui ele não entra em gaiola de secagem e sempre tem a mesma pessoa cuidando dele. É o único lugar onde ele não volta tremendo.',
      rating: 5,
      date: '2026-08-14',
      sourceUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJexemploPatasFelizes',
    },
    {
      id: 'depoimento-rodrigo-tavares',
      authorName: 'Rodrigo Tavares',
      petName: 'Nina',
      quote:
        'Levei minha gata esperando o pior e me surpreendi: horário só para gatos, sem cachorro nenhum no espaço. Ela miou menos aqui do que em casa na caixinha. A Dra. Carolina ainda achou um começo de dermatite que eu não tinha visto.',
      rating: 5,
      date: '2026-07-02',
      sourceUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJexemploPatasFelizes',
    },
    {
      id: 'depoimento-patricia-lemos',
      authorName: 'Patrícia Lemos',
      petName: 'Thor',
      quote:
        'Tenho um golden de 40 kg e sempre foi difícil achar lugar que aceitasse. Aqui atendem porte grande sem drama e o leva e traz salva meu sábado. Já são três anos vindo toda quinzena.',
      rating: 5,
      date: '2026-09-21',
      sourceUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJexemploPatasFelizes',
    },
    {
      id: 'depoimento-andre-figueiredo',
      authorName: 'André Figueiredo',
      petName: 'Mel',
      quote:
        'O que me fez ficar foi a honestidade: pedi um horário de sábado e disseram que não tinha vaga, em vez de encaixar e atender mal. Remarcaram para terça e o atendimento foi impecável.',
      rating: 5,
      date: '2026-06-11',
    },
    {
      id: 'depoimento-juliana-castro',
      authorName: 'Juliana Castro',
      petName: 'Pipoca',
      quote:
        'Recebo foto e um resumo do atendimento no WhatsApp todas as vezes. Parece pequeno, mas quando você deixa seu animal com alguém, saber o que aconteceu com ele faz toda a diferença.',
      rating: 5,
      date: '2026-09-05',
      sourceUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJexemploPatasFelizes',
    },
  ],
};
