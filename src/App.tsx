import { MobileContactBar } from '@/components/layout/MobileContactBar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { getSiteContent } from '@/content/index';
import { HomePage } from '@/pages/HomePage';

export function App() {
  const { business, nav } = getSiteContent();

  return (
    <>
      <SkipLink />
      <SiteHeader business={business} navItems={nav} />
      <main id="conteudo-principal">
        <HomePage />
      </main>
      <SiteFooter business={business} navItems={nav} />
      <MobileContactBar business={business} />
    </>
  );
}
