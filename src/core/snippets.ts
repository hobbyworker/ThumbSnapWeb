/** Copy-paste snippets that show a clickable thumbnail linking to the video. */
import { watchUrl } from './parse';

export interface SnippetInput {
  readonly id: string;
  readonly title?: string;
  readonly imageUrl: string;
  readonly width?: number;
  readonly height?: number;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function markdownSnippet({ id, title, imageUrl }: SnippetInput): string {
  const alt = (title ?? id).replace(/([\\[\]])/g, '\\$1');
  return `[![${alt}](${imageUrl})](${watchUrl(id)})`;
}

export function htmlSnippet({ id, title, imageUrl, width, height }: SnippetInput): string {
  const size = width && height ? ` width="${width}" height="${height}"` : '';
  return (
    `<a href="${watchUrl(id)}" target="_blank" rel="noopener">` +
    `<img src="${imageUrl}" alt="${escapeHtml(title ?? id)}"${size} loading="lazy"></a>`
  );
}
