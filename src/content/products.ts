import racaoPremiumPicture from '@/assets/images/produto-racao-premium.jpg?w=240;480;720&format=avif;webp;jpg&as=picture';
import racaoGatosPicture from '@/assets/images/produto-racao-gatos.jpg?w=240;480;720&format=avif;webp;jpg&as=picture';
import shampooPicture from '@/assets/images/produto-shampoo.jpg?w=240;480;720&format=avif;webp;jpg&as=picture';
import brinquedosPicture from '@/assets/images/produto-brinquedos.jpg?w=240;480;720&format=avif;webp;jpg&as=picture';
import coleirasPicture from '@/assets/images/produto-coleiras.jpg?w=240;480;720&format=avif;webp;jpg&as=picture';
import antipulgasPicture from '@/assets/images/produto-antipulgas.jpg?w=240;480;720&format=avif;webp;jpg&as=picture';
import petiscosPicture from '@/assets/images/produto-petiscos.jpg?w=240;480;720&format=avif;webp;jpg&as=picture';
import caixaTransportePicture from '@/assets/images/produto-caixa-transporte.jpg?w=240;480;720&format=avif;webp;jpg&as=picture';
import type { ProductsBlock } from '@/types/content';

/* ============================================================================
   Produtos em destaque (S-5) — de 4 a 8 itens visíveis (FR-020).
   É vitrine, não e-commerce: a aquisição acontece na loja física ou por
   contato (premissa de escopo da spec).

   `price` é omitido quando o valor não está confirmado: o card então exibe
   "Consulte disponibilidade e preço", nunca um valor desatualizado.

   PENDÊNCIA: PC-7 (catálogo, disponibilidade e preços reais).
   ============================================================================ */

export const products: ProductsBlock = {
  // FR-020: a seção declara explicitamente se existe venda on-line.
  onlineSalesAvailable: false,

  items: [
    {
      id: 'racao-premium-caes',
      name: 'Ração super premium para cães',
      category: 'Alimentação',
      description:
        'Linhas secas para filhotes, adultos e idosos, em sacos de 1 kg a 15 kg. Orientamos a porção pelo peso do seu cão.',
      image: {
        source: racaoPremiumPicture,
        alt: 'Sacos de ração super premium para cães expostos na prateleira da loja',
        width: 800,
        height: 800,
      },
      availability: 'in-store',
      cta: {
        label: 'Consultar ração',
        channel: 'whatsapp',
        intent: 'product:racao-premium-caes',
      },
    },
    {
      id: 'racao-gatos',
      name: 'Ração e sachês para gatos',
      category: 'Alimentação',
      description:
        'Opções secas e úmidas, incluindo linhas urinárias e para gatos castrados. Também vendemos sachês avulsos.',
      image: {
        source: racaoGatosPicture,
        alt: 'Prateleira com rações e sachês para gatos de diferentes marcas',
        width: 800,
        height: 800,
      },
      availability: 'in-store',
      cta: { label: 'Consultar para gatos', channel: 'whatsapp', intent: 'product:racao-gatos' },
    },
    {
      id: 'shampoo-terapeutico',
      name: 'Shampoos e condicionadores',
      category: 'Higiene',
      description:
        'Os mesmos produtos que usamos no banho, inclusive linhas hipoalergênicas e para pele sensível, para manutenção em casa.',
      image: {
        source: shampooPicture,
        alt: 'Frascos de shampoo e condicionador para cães e gatos em exposição',
        width: 800,
        height: 800,
      },
      availability: 'in-store',
      price: { amount: 68, currency: 'BRL' },
      cta: {
        label: 'Consultar shampoo',
        channel: 'whatsapp',
        intent: 'product:shampoo-terapeutico',
      },
    },
    {
      id: 'antipulgas',
      name: 'Antipulgas e vermífugos',
      category: 'Saúde',
      description:
        'Pipetas, comprimidos e coleiras das principais marcas, com a dosagem conferida pela veterinária antes da venda.',
      image: {
        source: antipulgasPicture,
        alt: 'Caixas de antipulgas e vermífugos para cães e gatos sobre o balcão',
        width: 800,
        height: 800,
      },
      availability: 'in-store',
      cta: { label: 'Consultar antipulgas', channel: 'whatsapp', intent: 'product:antipulgas' },
    },
    {
      id: 'petiscos-naturais',
      name: 'Petiscos e ossos naturais',
      category: 'Petiscos',
      description:
        'Petiscos desidratados sem corante nem conservante, e ossos naturais para roer. Vendidos por peso ou em pacote.',
      image: {
        source: petiscosPicture,
        alt: 'Potes com petiscos naturais desidratados e ossos para cães',
        width: 800,
        height: 800,
      },
      availability: 'in-store',
      price: { amount: 24, currency: 'BRL' },
      cta: { label: 'Consultar petiscos', channel: 'whatsapp', intent: 'product:petiscos-naturais' },
    },
    {
      id: 'coleiras-e-guias',
      name: 'Coleiras, peitorais e guias',
      category: 'Acessórios',
      description:
        'Peitorais antipuxão, coleiras de identificação gravadas na hora e guias curtas e longas, do porte P ao GG.',
      image: {
        source: coleirasPicture,
        alt: 'Coleiras, peitorais e guias de diferentes tamanhos pendurados no expositor',
        width: 800,
        height: 800,
      },
      availability: 'in-store',
      cta: { label: 'Consultar coleiras', channel: 'whatsapp', intent: 'product:coleiras-e-guias' },
    },
    {
      id: 'brinquedos',
      name: 'Brinquedos e enriquecimento',
      category: 'Brinquedos',
      description:
        'Mordedores resistentes, bolas, brinquedos interativos de ração e arranhadores para gatos.',
      image: {
        source: brinquedosPicture,
        alt: 'Cesto com mordedores, bolas e brinquedos interativos para pets',
        width: 800,
        height: 800,
      },
      availability: 'in-store',
      cta: { label: 'Consultar brinquedos', channel: 'whatsapp', intent: 'product:brinquedos' },
    },
    {
      id: 'caixas-de-transporte',
      name: 'Caixas de transporte',
      category: 'Acessórios',
      description:
        'Modelos aprovados para viagem aérea, do porte P ao G. Encomendamos o tamanho certo se não estiver em estoque.',
      image: {
        source: caixaTransportePicture,
        alt: 'Caixas de transporte para cães e gatos de diferentes tamanhos empilhadas',
        width: 800,
        height: 800,
      },
      availability: 'on-request',
      cta: {
        label: 'Consultar caixa',
        channel: 'whatsapp',
        intent: 'product:caixas-de-transporte',
      },
    },
  ],
};
