import {
  CameraIcon,
  CarIcon,
  CatIcon,
  CircleCheckBigIcon,
  HeartHandshakeIcon,
  HouseIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StethoscopeIcon,
  UserCheckIcon,
  WindIcon,
  type LucideIcon,
} from 'lucide-react';

/* ============================================================================
   Registro explícito dos ícones usados pelo conteúdo.

   Importar o barril `icons` do lucide-react arrastaria os mais de 6.000 ícones
   para o bundle (~1 MB), estourando o orçamento de JavaScript do Princípio IX.
   Este mapa mantém o tree-shaking funcionando: só o que está aqui é embarcado.

   Ao adicionar um diferencial novo em src/content/differentials.ts com um
   ícone que não esteja nesta lista, inclua-o aqui também.
   ============================================================================ */

export const CONTENT_ICONS: Record<string, LucideIcon> = {
  Camera: CameraIcon,
  Car: CarIcon,
  Cat: CatIcon,
  CircleCheckBig: CircleCheckBigIcon,
  HeartHandshake: HeartHandshakeIcon,
  House: HouseIcon,
  Scissors: ScissorsIcon,
  ShieldCheck: ShieldCheckIcon,
  Sparkles: SparklesIcon,
  Stethoscope: StethoscopeIcon,
  UserCheck: UserCheckIcon,
  Wind: WindIcon,
};

/** Resolve o ícone pelo nome declarado no conteúdo, com fallback seguro. */
export function resolveContentIcon(name: string): LucideIcon {
  return CONTENT_ICONS[name] ?? CircleCheckBigIcon;
}
