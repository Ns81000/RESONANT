// Inline SVG for the Resonant signal glyph — 3 ascending blocks.
const logoSvg = (color: string = "#141413", highlightColor: string = "#cc785c") => `
<svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="25" y="60" width="12" height="12" rx="3" fill="${color}"/>
  <rect x="45" y="45" width="12" height="12" rx="3" fill="${color}"/>
  <rect x="65" y="30" width="12" height="12" rx="3" fill="${highlightColor}"/>
</svg>`;
export default logoSvg;
