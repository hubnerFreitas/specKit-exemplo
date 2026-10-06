import { useEffect, useState } from 'react';

import type { SectionId } from '@/types/analytics';

/**
 * Seção atualmente visível, para marcar o item ativo da navegação.
 * Retorna `null` antes da hidratação — nenhum acesso a `window` fora do
 * `useEffect`, exigência do prerender (research.md R-01).
 */
export function useScrollSpy(sectionIds: readonly SectionId[]): SectionId | null {
  const [activeId, setActiveId] = useState<SectionId | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .toSorted((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible !== undefined) {
          setActiveId(visible.target.id as SectionId);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.25, 0.5] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
