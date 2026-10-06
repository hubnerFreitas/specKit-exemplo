/**
 * Tipos dos imports processados por vite-imagetools.
 *
 * O pacote não publica um `client.d.ts`, então declaramos aqui o formato do
 * objeto retornado por `?as=picture` — a forma que `ResponsiveImage` consome.
 */

/** Resultado de `...?as=picture`: um srcset por formato + o fallback. */
type ImagetoolsPicture = {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
};

declare module '*?as=picture' {
  const picture: ImagetoolsPicture;
  export default picture;
}

declare module '*&as=picture' {
  const picture: ImagetoolsPicture;
  export default picture;
}

declare module '*?as=metadata' {
  const metadata: { width: number; height: number; format: string; src: string };
  export default metadata;
}

declare module '*&as=metadata' {
  const metadata: { width: number; height: number; format: string; src: string };
  export default metadata;
}
