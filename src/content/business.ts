import type { Business, NavItem, SeoContent } from '@/types/content';

/* ============================================================================
   Dados do negócio — fonte ÚNICA do NAP.
   Todas as exibições de nome, endereço e telefone na página derivam daqui, e o
   JSON-LD também: é assim que FR-029/AC-017 deixa de depender de disciplina
   humana.

   PENDÊNCIAS ABERTAS (spec.md): PC-1 a PC-5 e PC-12.
   Os valores abaixo são de um estabelecimento de exemplo e DEVEM ser
   substituídos pelos dados reais antes da publicação. O NAP precisa ficar
   idêntico ao do Perfil da Empresa no Google (AC-017).
   ============================================================================ */

export const business: Business = {
  legalName: 'Patas Felizes Comércio e Serviços para Animais Ltda.',
  tradeName: 'Patas Felizes',
  taxId: '34.512.890/0001-47',
  foundedYear: 2014,

  address: {
    street: 'Rua Doutor Alfredo de Castro',
    number: '412',
    district: 'Vila Mariana',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '04110-060',
    landmark: 'a 300 m do metrô Santa Cruz, em frente à praça Alcides Bueno',
    coordinates: { latitude: -23.5983, longitude: -46.6395 },
  },

  phone: { e164: '+551155392814', display: '(11) 5539-2814' },
  whatsapp: { e164: '+5511971042814', display: '(11) 97104-2814' },
  email: 'contato@patasfelizes.com.br',

  hours: {
    weekly: [
      { weekday: 0, closed: true, intervals: [] },
      { weekday: 1, closed: false, intervals: [{ opensAt: '08:00', closesAt: '19:00' }] },
      { weekday: 2, closed: false, intervals: [{ opensAt: '08:00', closesAt: '19:00' }] },
      { weekday: 3, closed: false, intervals: [{ opensAt: '08:00', closesAt: '19:00' }] },
      { weekday: 4, closed: false, intervals: [{ opensAt: '08:00', closesAt: '19:00' }] },
      { weekday: 5, closed: false, intervals: [{ opensAt: '08:00', closesAt: '19:00' }] },
      { weekday: 6, closed: false, intervals: [{ opensAt: '08:00', closesAt: '17:00' }] },
    ],
    exceptions: [],
  },

  serviceAreas: ['Vila Mariana', 'Paraíso', 'Ana Rosa', 'Chácara Klabin', 'Ipiranga', 'Saúde'],

  socials: [
    {
      platform: 'instagram',
      url: 'https://www.instagram.com/patasfelizesvilamariana',
      label: 'Instagram do Patas Felizes',
    },
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/patasfelizesvilamariana',
      label: 'Facebook do Patas Felizes',
    },
  ],

  responsiblePerson: {
    name: 'Dra. Carolina Esteves',
    role: 'Médica-veterinária responsável',
    credential: 'CRMV-SP 29.184',
  },

  privacyPolicyUrl: '/politica-de-privacidade.html',
  responseTimeLabel: 'Respondemos em até 1 hora dentro do horário de atendimento.',
};

/* ============================================================================
   Navegação — mapeia os SectionId internos (em inglês, usados no código e nos
   eventos) para as âncoras públicas em português. Ponto único de verdade,
   consumido por SiteNav, SiteFooter e pelo scroll-margin das âncoras
   (contracts/seo-structured-data.md).
   ============================================================================ */

export const navItems: NavItem[] = [
  { id: 'services', label: 'Serviços', anchor: '#services' },
  { id: 'products', label: 'Produtos', anchor: '#products' },
  { id: 'about', label: 'Sobre nós', anchor: '#about' },
  { id: 'testimonials', label: 'Depoimentos', anchor: '#testimonials' },
  { id: 'faq', label: 'Dúvidas', anchor: '#faq' },
  { id: 'contact', label: 'Contato', anchor: '#contact' },
];

/* ============================================================================
   Metadados de busca e compartilhamento.
   title: 30–60 caracteres com serviço e bairro; description: 120–158 (FR-027).
   ============================================================================ */

export const seo: SeoContent = {
  title: 'Pet Shop e Banho e Tosa na Vila Mariana | Patas Felizes',
  description:
    'Banho e tosa, consulta veterinária e produtos para cães e gatos na Vila Mariana, São Paulo. Sem gaiola de secagem, há 11 anos. Agende pelo WhatsApp.',
  canonicalUrl: 'https://www.patasfelizes.com.br/',
  ogImage: {
    url: '/og/og-default.jpg',
    alt: 'Fachada e espaço de atendimento do Patas Felizes, na Vila Mariana',
    width: 1200,
    height: 630,
  },
  locale: 'pt-BR',
};
