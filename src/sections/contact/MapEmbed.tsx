import { MapPinnedIcon } from 'lucide-react';
import { useState } from 'react';

import mapaPicture from '@/assets/images/mapa-fachada.jpg?w=480;768;1200&format=avif;webp;jpg&as=picture';
import { ResponsiveImage } from '@/components/shared/ResponsiveImage';
import { Button } from '@/components/ui/button';
import { trackConversion } from '@/lib/analytics';
import type { Business } from '@/types/content';

export type MapEmbedProps = {
  business: Business;
};

/**
 * Mapa no padrão *facade* (research.md R-12).
 *
 * O `iframe` custa centenas de KB e várias conexões de terceiros, o que
 * destruiria o orçamento de performance do Princípio IX e levaria dados do
 * visitante a terceiros antes do consentimento. Então ele só é montado após o
 * clique — e o endereço em texto e o link de rota, que ficam na
 * `ContactSection`, atendem FR-024 sem nenhum terceiro.
 */
export function MapEmbed({ business }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const { coordinates } = business.address;

  const embedUrl = `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&z=16&output=embed`;

  const handleLoad = (): void => {
    trackConversion({ channel: 'route', section: 'contact', intent: 'open-map' });
    setLoaded(true);
  };

  if (loaded) {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <iframe
          src={embedUrl}
          title={`Mapa da localização do ${business.tradeName}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          // allow-same-origin NÃO entra aqui: junto com allow-scripts
          // permitiria ao frame remover o próprio sandbox.
          sandbox="allow-scripts allow-popups"
          className="aspect-video w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      <ResponsiveImage
        image={{
          source: mapaPicture,
          alt: '',
          decorative: true,
          width: 1200,
          height: 675,
        }}
        sizes="(min-width: 1024px) 45vw, 100vw"
        imgClassName="aspect-video"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-inverse/45 p-5 text-center">
        <p className="text-base font-semibold text-foreground-inverse">
          {business.address.landmark}
        </p>
        <Button variant="accent" onClick={handleLoad}>
          <MapPinnedIcon aria-hidden="true" className="size-5 shrink-0" />
          Ver no mapa
        </Button>
      </div>
    </div>
  );
}
