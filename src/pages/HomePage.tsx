import { getSiteContent } from '@/content/index';
import { AboutSection } from '@/sections/about/AboutSection';
import { ContactSection } from '@/sections/contact/ContactSection';
import { DifferentialsSection } from '@/sections/differentials/DifferentialsSection';
import { FaqSection } from '@/sections/faq/FaqSection';
import { HeroSection } from '@/sections/hero/HeroSection';
import { ProductsSection } from '@/sections/products/ProductsSection';
import { ServicesSection } from '@/sections/services/ServicesSection';
import { TestimonialsSection } from '@/sections/testimonials/TestimonialsSection';

/**
 * ÚNICO consumidor do provider de conteúdo.
 *
 * As seções recebem tudo por props e nunca importam `src/content/` — é essa
 * regra que torna a migração para um CMS uma mudança de duas peças (provider +
 * tipo de retorno) em vez de uma varredura por todos os componentes
 * (research.md R-05).
 *
 * A ordem das seções é a definida em plan.md: S-1 a S-8.
 */
export function HomePage() {
  const { business, hero, about, differentials, services, products, testimonials, faq } =
    getSiteContent();

  return (
    <>
      <HeroSection content={hero} business={business} />
      <AboutSection content={about} business={business} />
      <DifferentialsSection items={differentials} />
      <ServicesSection items={services} business={business} />
      <ProductsSection block={products} business={business} />
      <TestimonialsSection block={testimonials} business={business} />
      <FaqSection items={faq} business={business} />
      <ContactSection business={business} services={services} />
    </>
  );
}
