import { MenuIcon } from 'lucide-react';
import { useState } from 'react';

import { ContactLink } from '@/components/shared/ContactLink';
import { WhatsAppCta } from '@/components/shared/WhatsAppCta';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { cn } from '@/lib/utils';
import type { SectionId } from '@/types/analytics';
import type { Business, NavItem } from '@/types/content';

export type SiteNavProps = {
  navItems: NavItem[];
  business: Business;
};

/**
 * Navegação principal.
 *
 * No mobile usa o `Sheet` (Radix Dialog), que já resolve foco preso, `Esc`
 * para fechar e retorno do foco ao gatilho (AC-022).
 * O item ativo recebe `aria-current="location"` e uma barra de destaque — a
 * marcação não depende só de cor (FR-036).
 */
export function SiteNav({ navItems, business }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const sectionIds = navItems.map((item) => item.id);
  const activeId = useScrollSpy(sectionIds as readonly SectionId[]);

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Navegação principal" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={item.anchor}
                  {...(isActive ? { 'aria-current': 'location' as const } : {})}
                  className={cn(
                    'relative inline-flex min-h-(--size-touch-target) items-center rounded-md px-3 text-base font-medium transition-colors',
                    isActive
                      ? 'font-bold text-brand-700 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-brand-600'
                      : 'text-foreground hover:text-brand-700',
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
            <MenuIcon aria-hidden="true" className="size-6" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[88%] max-w-sm">
          <SheetHeader>
            <SheetTitle>{business.tradeName}</SheetTitle>
          </SheetHeader>

          <nav aria-label="Navegação principal" className="overflow-y-auto px-2">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.id}>
                  <SheetClose asChild>
                    <a
                      href={item.anchor}
                      className="flex min-h-13 items-center rounded-lg px-3 text-lg font-medium text-foreground transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>

          <SheetFooter>
            <WhatsAppCta
              intent={{ kind: 'general' }}
              business={business}
              section="header"
              label="Agendar pelo WhatsApp"
              fullWidth
            />
            <ContactLink kind="phone" business={business} section="header" />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
