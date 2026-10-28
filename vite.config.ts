/// <reference types="vitest/config" />
/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import pkg from './package.json' with { type: 'json' };

const banner = `/*! ThumbSnapWeb v${pkg.version} | MIT License | (c) 2026 hobbyworker | https://github.com/hobbyworker/ThumbSnapWeb
 *  Includes Lit (BSD-3-Clause, (c) Google LLC); see THIRD_PARTY_LICENSES.txt */`;

/** Ships the licenses of bundled dependencies next to the bundle. */
function thirdPartyLicenses(): Plugin {
  return {
    name: 'thumbsnap-third-party-licenses',
    apply: 'build',
    generateBundle() {
      const lit = readFileSync(new URL('./node_modules/lit/LICENSE', import.meta.url), 'utf8');
      this.emitFile({
        type: 'asset',
        fileName: 'THIRD_PARTY_LICENSES.txt',
        source: `ThumbSnapWeb bundles the following packages.\n\n== lit, @lit/reactive-element, lit-html, lit-element ==\n\n${lit}`,
      });
    },
  };
}

export default defineConfig({
  plugins: [thirdPartyLicenses()],
  build: {
    target: 'es2022',
    sourcemap: true,
    assetsDir: '',
    rolldownOptions: {
      // A plain (non-lib) build so the browser-ready module is fully minified.
      input: 'src/auto.ts',
      preserveEntrySignatures: 'strict',
      output: {
        format: 'es',
        entryFileNames: 'thumbsnap.js',
        // Added after minification, which would otherwise drop it.
        postBanner: banner,
      },
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
