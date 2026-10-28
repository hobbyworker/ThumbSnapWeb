import { css } from 'lit';

/**
 * Hosts can restyle the tool with:
 * --thumbsnap-accent, --thumbsnap-accent-hover, --thumbsnap-radius, --thumbsnap-font.
 */
export const styles = css`
  :host {
    --ts-accent: var(--thumbsnap-accent, #d93025);
    --ts-accent-hover: var(--thumbsnap-accent-hover, #b3261e);
    --ts-accent-text: #b3261e;
    --ts-on-accent: #fff;
    --ts-radius: var(--thumbsnap-radius, 12px);
    --ts-surface: #fff;
    --ts-surface-2: #f4f5f7;
    --ts-surface-3: #e8eaee;
    --ts-border: #dde0e5;
    --ts-text: #1f2328;
    --ts-muted: #59616c;
    --ts-link: #1a6bb0;
    --ts-preview: #eceef1;
    --ts-warn-bg: #fff4e5;
    --ts-warn-text: #7a4200;
    --ts-shadow: 0 1px 2px rgb(0 0 0 / 4%), 0 6px 20px rgb(0 0 0 / 4%);

    display: block;
    container-type: inline-size;
    color: var(--ts-text);
    font-family: var(--thumbsnap-font, inherit);
    line-height: 1.5;
    color-scheme: light;
    -webkit-text-size-adjust: 100%;
  }

  :host([data-scheme='dark']) {
    --ts-accent-text: #ff8a80;
    --ts-surface: #2b2c30;
    --ts-surface-2: #33353a;
    --ts-surface-3: #3e4046;
    --ts-border: #44474e;
    --ts-text: #e6e7ea;
    --ts-muted: #a6abb4;
    --ts-link: #8ab4f8;
    --ts-preview: #1d1e21;
    --ts-warn-bg: #3a2c16;
    --ts-warn-text: #ffcc80;
    --ts-shadow: none;
    color-scheme: dark;
  }

  :host([hidden]) {
    display: none;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
  }

  svg {
    flex: none;
  }

  :focus-visible {
    outline: 2px solid var(--ts-accent);
    outline-offset: 2px;
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
    font-size: 0.9em;
  }

  .ts {
    display: grid;
    gap: 1rem;
  }

  .panel {
    background: var(--ts-surface);
    border: 1px solid var(--ts-border);
    border-radius: var(--ts-radius);
    box-shadow: var(--ts-shadow);
  }

  /* Search form */
  .search {
    display: grid;
    gap: 0.625rem;
    padding: 1rem;
  }

  .label {
    font-weight: 700;
  }

  .field {
    position: relative;
  }

  textarea {
    display: block;
    width: 100%;
    min-height: 3.25rem;
    max-height: 15rem;
    padding: 0.8rem 2.75rem 0.8rem 0.95rem;
    border: 1px solid var(--ts-border);
    border-radius: calc(var(--ts-radius) - 2px);
    background: var(--ts-surface-2);
    font-size: 1rem;
    line-height: 1.5;
    resize: none;
    overflow-y: auto;
    transition:
      border-color 0.15s,
      box-shadow 0.15s,
      background-color 0.15s;
  }

  textarea::placeholder {
    color: var(--ts-muted);
    opacity: 0.85;
  }

  textarea:focus {
    outline: none;
    border-color: var(--ts-accent);
    background: var(--ts-surface);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ts-accent) 20%, transparent);
  }

  .field-clear {
    position: absolute;
    top: 0.45rem;
    inset-inline-end: 0.45rem;
  }

  .search-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem 0.75rem;
  }

  .hint {
    margin: 0;
    color: var(--ts-muted);
    font-size: 0.85em;
  }

  .search-actions {
    display: flex;
    gap: 0.5rem;
    margin-inline-start: auto;
  }

  .options {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1.25rem;
    padding-top: 0.75rem;
    border-top: 1px dashed var(--ts-border);
    color: var(--ts-muted);
    font-size: 0.88em;
  }

  .opt {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    cursor: pointer;
  }

  select {
    padding: 0.3rem 0.5rem;
    border: 1px solid var(--ts-border);
    border-radius: 8px;
    background: var(--ts-surface-2);
    color: var(--ts-text);
    cursor: pointer;
  }

  input[type='checkbox'] {
    width: 1rem;
    height: 1rem;
    margin: 0;
    accent-color: var(--ts-accent);
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    min-height: 2.5rem;
    padding: 0.45rem 1rem;
    border: 1px solid var(--ts-border);
    border-radius: 999px;
    background: var(--ts-surface);
    color: var(--ts-text);
    font-size: 0.92em;
    font-weight: 600;
    line-height: 1.2;
    white-space: nowrap;
    cursor: pointer;
    transition:
      background-color 0.15s,
      border-color 0.15s;
  }

  .btn:hover:not(:disabled) {
    background: var(--ts-surface-2);
  }

  .btn.primary {
    border-color: var(--ts-accent);
    background: var(--ts-accent);
    color: var(--ts-on-accent);
  }

  .btn.primary:hover:not(:disabled) {
    border-color: var(--ts-accent-hover);
    background: var(--ts-accent-hover);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn.sm {
    min-height: 2rem;
    padding: 0.25rem 0.7rem;
    font-size: 0.82em;
  }

  .btn.sm svg {
    width: 15px;
    height: 15px;
  }

  .icon-btn {
    display: inline-grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--ts-muted);
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color 0.15s,
      color 0.15s;
  }

  .icon-btn:hover {
    background: var(--ts-surface-3);
    color: var(--ts-text);
  }

  .link-btn {
    padding: 0.2rem 0.3rem;
    border: 0;
    background: none;
    color: var(--ts-link);
    font-size: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }

  /* Recent videos */
  .recent {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem 0.5rem;
    font-size: 0.86em;
  }

  .recent-label {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--ts-muted);
    font-weight: 600;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    max-width: 14rem;
    padding: 0.2rem 0.75rem 0.2rem 0.25rem;
    border: 1px solid var(--ts-border);
    border-radius: 999px;
    background: var(--ts-surface);
    cursor: pointer;
  }

  .chip:hover {
    background: var(--ts-surface-2);
  }

  .chip img {
    width: 2.4rem;
    height: 1.35rem;
    border-radius: 999px;
    object-fit: cover;
    background: var(--ts-preview);
  }

  .chip span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .msg {
    margin: 0;
    padding: 0.75rem 1rem;
    border-radius: calc(var(--ts-radius) - 4px);
    background: var(--ts-surface-2);
    color: var(--ts-muted);
    font-size: 0.9em;
  }

  .msg.warn {
    background: var(--ts-warn-bg);
    color: var(--ts-warn-text);
  }

  .batch {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-weight: 600;
  }

  .results {
    display: grid;
    gap: 1rem;
  }

  /* Video */
  .video {
    overflow: hidden;
  }

  .v-head {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'cover' 'info' 'actions';
    gap: 0.75rem 1rem;
    padding: 1rem;
  }

  .v-remove {
    position: absolute;
    top: 0.5rem;
    inset-inline-end: 0.5rem;
    background: var(--ts-surface);
  }

  .multi .v-info {
    padding-inline-end: 1.75rem;
  }

  .v-cover {
    grid-area: cover;
    display: grid;
    place-items: center;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: calc(var(--ts-radius) - 4px);
    background: var(--ts-preview);
  }

  .v-cover img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .v-info {
    grid-area: info;
    display: grid;
    align-content: start;
    gap: 0.35rem;
    min-width: 0;
  }

  .v-kicker {
    margin: 0;
    color: var(--ts-muted);
    font-size: 0.82em;
  }

  .v-title {
    margin: 0;
    font-size: 1.08em;
    font-weight: 700;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .v-title a {
    color: inherit;
    text-decoration: none;
  }

  .v-title a:hover {
    text-decoration: underline;
  }

  .v-sub {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem 0.45rem;
    margin: 0;
    color: var(--ts-muted);
    font-size: 0.88em;
  }

  .v-sub a {
    color: var(--ts-link);
    text-decoration: none;
  }

  .v-sub a:hover {
    text-decoration: underline;
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0.15rem 0 0;
  }

  .badge {
    padding: 0.1rem 0.6rem;
    border-radius: 999px;
    background: var(--ts-surface-3);
    font-size: 0.78em;
    font-weight: 600;
  }

  .badge.accent {
    background: color-mix(in srgb, var(--ts-accent) 14%, transparent);
    color: var(--ts-accent-text);
  }

  .palette {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.25rem;
  }

  .swatch {
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    border: 1px solid rgb(127 127 127 / 35%);
    border-radius: 6px;
    background: var(--swatch);
    cursor: pointer;
  }

  .v-actions {
    grid-area: actions;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
  }

  .spacer {
    flex: 1;
  }

  .v-body {
    display: grid;
    gap: 0.25rem;
    padding: 0 1rem 1rem;
  }

  .sec {
    padding-top: 0.75rem;
    border-top: 1px solid var(--ts-border);
  }

  .sec-title,
  summary {
    margin: 0;
    font-size: 0.98em;
    font-weight: 700;
  }

  summary {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.15rem 0;
    list-style: none;
    cursor: pointer;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary svg {
    transform: rotate(-90deg);
    transition: transform 0.2s;
  }

  details[open] > summary svg {
    transform: none;
  }

  .sec-hint {
    margin: 0.2rem 0 0.75rem;
    color: var(--ts-muted);
    font-size: 0.85em;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 12.5rem), 1fr));
    gap: 0.75rem;
    padding-bottom: 0.5rem;
  }

  /* Image card */
  .card {
    display: flex;
    flex-direction: column;
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--ts-border);
    border-radius: calc(var(--ts-radius) - 4px);
    background: var(--ts-surface);
  }

  .card[data-status='missing'] {
    opacity: 0.6;
  }

  .preview {
    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--ts-preview);
  }

  .preview-btn {
    position: absolute;
    inset: 0;
    padding: 0;
    border: 0;
    background: none;
    cursor: zoom-in;
  }

  .preview-btn:focus-visible {
    outline-offset: -2px;
  }

  /* scale-down: small files keep their real size, large or tall ones (Shorts frames) fit the box. */
  .preview img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: scale-down;
  }

  .tag {
    position: absolute;
    top: 0.4rem;
    inset-inline-start: 0.4rem;
    padding: 0.05rem 0.5rem;
    border-radius: 999px;
    background: var(--ts-accent);
    color: var(--ts-on-accent);
    font-size: 0.72em;
    font-weight: 700;
  }

  .na {
    padding: 0.5rem;
    color: var(--ts-muted);
    font-size: 0.82em;
    text-align: center;
  }

  figcaption {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.1rem 0.5rem;
    padding: 0.5rem 0.7rem 0.15rem;
    font-size: 0.84em;
  }

  .c-label {
    font-weight: 600;
  }

  .c-meta {
    color: var(--ts-muted);
    font-variant-numeric: tabular-nums;
  }

  .c-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.1rem;
    margin-top: auto;
    padding: 0.15rem 0.3rem 0.35rem;
  }

  .size-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    padding: 0.35rem 0.7rem 0;
  }

  .size-chip {
    padding: 0.05rem 0.5rem;
    border: 1px solid var(--ts-border);
    border-radius: 999px;
    background: var(--ts-surface);
    font-size: 0.75em;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  .size-chip[aria-pressed='true'] {
    border-color: var(--ts-text);
    background: var(--ts-text);
    color: var(--ts-surface);
  }

  .size-chip:disabled {
    opacity: 0.4;
    text-decoration: line-through;
    cursor: not-allowed;
  }

  /* Embed snippets */
  .snippets {
    display: grid;
    gap: 0.6rem;
    padding-bottom: 0.5rem;
  }

  .snippet {
    overflow: hidden;
    border: 1px solid var(--ts-border);
    border-radius: calc(var(--ts-radius) - 4px);
  }

  .snippet-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem 0.4rem 0.3rem 0.75rem;
    background: var(--ts-surface-2);
    font-size: 0.82em;
    font-weight: 600;
  }

  pre {
    margin: 0;
    padding: 0.65rem 0.75rem;
    overflow-x: auto;
    font-size: 0.8em;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .spinner {
    width: 1.6rem;
    height: 1.6rem;
    border: 3px solid color-mix(in srgb, var(--ts-muted) 30%, transparent);
    border-top-color: var(--ts-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .disclaimer {
    margin: 0;
    color: var(--ts-muted);
    font-size: 0.78em;
    text-align: center;
  }

  .toast {
    position: fixed;
    bottom: 1.25rem;
    inset-inline: 0;
    z-index: 10;
    width: fit-content;
    max-width: calc(100vw - 2rem);
    margin-inline: auto;
    padding: 0.6rem 1.1rem;
    border-radius: 999px;
    background: var(--ts-text);
    color: var(--ts-surface);
    font-size: 0.9em;
    font-weight: 600;
    box-shadow: 0 6px 24px rgb(0 0 0 / 25%);
    opacity: 0;
    transform: translateY(0.5rem);
    transition:
      opacity 0.2s,
      transform 0.2s;
    pointer-events: none;
  }

  .toast.show {
    opacity: 1;
    transform: none;
  }

  /* Full-size viewer */
  .viewer {
    max-width: min(96vw, 1400px);
    max-height: 94vh;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: var(--ts-radius);
    background: var(--ts-surface);
    color: var(--ts-text);
  }

  .viewer::backdrop {
    background: rgb(0 0 0 / 72%);
  }

  .viewer figure {
    display: grid;
    margin: 0;
  }

  .viewer img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: calc(94vh - 3.5rem);
    margin: auto;
    background: var(--ts-preview);
  }

  .viewer figcaption {
    align-items: center;
    padding: 0.4rem 0.5rem 0.4rem 1rem;
    font-size: 0.9em;
  }

  .viewer-actions {
    display: flex;
    gap: 0.1rem;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  @container (min-width: 36rem) {
    .v-head {
      grid-template-columns: 15rem minmax(0, 1fr);
      grid-template-areas: 'cover info' 'cover actions';
      align-items: start;
    }
  }

  @container (max-width: 30rem) {
    .search-actions {
      width: 100%;
    }

    .search-actions .btn {
      flex: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition: none !important;
    }

    .spinner {
      animation-duration: 2.4s;
    }
  }
`;
