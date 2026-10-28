import { html, svg, type SVGTemplateResult, type TemplateResult } from 'lit';

const icon = (body: SVGTemplateResult): TemplateResult =>
  html`<svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    ${body}
  </svg>`;

export const icons = {
  download: icon(svg`<path d="M12 4v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M5 19h14"/>`),
  copy: icon(
    svg`<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/>`,
  ),
  link: icon(
    svg`<path d="M10 13.5a4 4 0 0 0 5.66.34l3-3a4 4 0 0 0-5.66-5.66l-1.2 1.2"/><path d="M14 10.5a4 4 0 0 0-5.66-.34l-3 3a4 4 0 0 0 5.66 5.66l1.2-1.2"/>`,
  ),
  external: icon(
    svg`<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>`,
  ),
  share: icon(svg`<path d="M12 3v12"/><path d="m8 7 4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>`),
  archive: icon(
    svg`<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>`,
  ),
  paste: icon(
    svg`<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/>`,
  ),
  close: icon(svg`<path d="M6 6l12 12"/><path d="M18 6 6 18"/>`),
  search: icon(svg`<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>`),
  play: icon(svg`<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor"/>`),
  chevron: icon(svg`<path d="m6 9 6 6 6-6"/>`),
  clock: icon(svg`<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`),
  retry: icon(svg`<path d="M20 11a8 8 0 1 0-2.34 5.66"/><path d="M20 5v6h-6"/>`),
};
