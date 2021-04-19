export function svg2file(svg: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const file = new File([blob], `${+new Date()}.svg`, { type: 'image/svg+xml' });
  return file;
}
