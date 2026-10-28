/// <reference types="node" />
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { baseName, fileName, sanitizeFilename } from '../src/core/filename';
import { findContentRect } from '../src/core/image';
import { parseOEmbed } from '../src/core/oembed';
import { htmlSnippet, markdownSnippet } from '../src/core/snippets';
import { FRAMES, ORIGINALS, THUMBNAILS, frameVariant, imageUrl } from '../src/core/variants';
import { crc32, createZip } from '../src/core/zip';

describe('variants', () => {
  it('builds CDN URLs', () => {
    expect(imageUrl('abc', 'maxresdefault')).toBe('https://i.ytimg.com/vi/abc/maxresdefault.jpg');
    expect(imageUrl('abc', 'hqdefault', 'webp')).toBe('https://i.ytimg.com/vi_webp/abc/hqdefault.webp');
  });

  it('lists every known file', () => {
    expect(THUMBNAILS.map((v) => v.key)).toEqual(['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default']);
    expect(ORIGINALS.map((v) => v.key)).toEqual(['oar1', 'oar2', 'oar3', 'frame0']);
    expect(FRAMES.map((v) => v.key)).toEqual([
      ...['maxres1', 'sd1', 'hq1', 'mq1', '1'],
      ...['maxres2', 'sd2', 'hq2', 'mq2', '2'],
      ...['maxres3', 'sd3', 'hq3', 'mq3', '3'],
    ]);
    expect(frameVariant(2, 'sd')).toMatchObject({ key: 'sd2', width: 640, height: 480 });
  });
});

describe('zip', () => {
  it('computes CRC-32', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
  });

  /** Reads entries back through the central directory, checking each CRC and the UTF-8 flag. */
  function readZip(bytes: Uint8Array): Record<string, string> {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const end = bytes.length - 22;
    expect(view.getUint32(end, true)).toBe(0x06054b50);
    const count = view.getUint16(end + 10, true);
    let p = view.getUint32(end + 16, true);
    const files: Record<string, string> = {};
    for (let i = 0; i < count; i++) {
      expect(view.getUint32(p, true)).toBe(0x02014b50);
      expect(view.getUint16(p + 8, true) & 0x0800).toBe(0x0800);
      const crc = view.getUint32(p + 16, true);
      const size = view.getUint32(p + 24, true);
      const nameLength = view.getUint16(p + 28, true);
      const offset = view.getUint32(p + 42, true);
      const name = new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + nameLength));
      const start = offset + 30 + view.getUint16(offset + 26, true) + view.getUint16(offset + 28, true);
      const data = bytes.subarray(start, start + size);
      expect(crc32(data)).toBe(crc);
      files[name] = new TextDecoder().decode(data);
      p += 46 + nameLength;
    }
    return files;
  }

  it('writes a valid archive with UTF-8 names and de-duplicated entries', async () => {
    const zip = await createZip([
      { name: 'a.txt', data: new TextEncoder().encode('hello') },
      { name: '한글 제목/b.txt', data: new Blob(['world']) },
      { name: 'a.txt', data: new TextEncoder().encode('again') },
    ]);
    const bytes = new Uint8Array(await zip.arrayBuffer());
    expect(readZip(bytes)).toEqual({ 'a.txt': 'hello', '한글 제목/b.txt': 'world', 'a (2).txt': 'again' });

    // Cross-check with Info-ZIP when it is installed (its name output ignores the UTF-8 flag on macOS).
    const dir = mkdtempSync(join(tmpdir(), 'thumbsnap-zip-'));
    const file = join(dir, 'test.zip');
    writeFileSync(file, bytes);
    let hasUnzip = true;
    try {
      execFileSync('unzip', ['-v'], { stdio: 'ignore' });
    } catch {
      hasUnzip = false;
    }
    if (hasUnzip) expect(() => execFileSync('unzip', ['-tq', file])).not.toThrow();
  });
});

describe('filename', () => {
  it('strips characters that file systems reject', () => {
    expect(sanitizeFilename('a/b\\c:d*e?f"g<h>i|j')).toBe('a b c d e f g h i j');
    expect(sanitizeFilename('  ..hidden..  ')).toBe('hidden');
    expect(sanitizeFilename('가'.repeat(100), 10)).toBe('가'.repeat(10));
  });

  it('names files by ID or by title', () => {
    expect(baseName('dQw4w9WgXcQ', 'Never: Gonna?', 'id')).toBe('dQw4w9WgXcQ');
    expect(baseName('dQw4w9WgXcQ', 'Never: Gonna?', 'title')).toBe('Never Gonna [dQw4w9WgXcQ]');
    expect(baseName('dQw4w9WgXcQ', undefined, 'title')).toBe('dQw4w9WgXcQ');
    expect(fileName('x', 'maxresdefault', 'jpg')).toBe('x-maxresdefault.jpg');
  });
});

describe('oEmbed', () => {
  it('reads title, author, orientation and the thumbnail video ID', () => {
    const info = parseOEmbed({
      title: 'Short',
      author_name: 'YouTube',
      author_url: 'https://www.youtube.com/@YouTube',
      width: 113,
      height: 200,
      thumbnail_url: 'https://i.ytimg.com/vi/0HAETg7L15o/hq2.jpg',
    });
    expect(info).toEqual({
      title: 'Short',
      author: 'YouTube',
      authorUrl: 'https://www.youtube.com/@YouTube',
      vertical: true,
      videoId: '0HAETg7L15o',
    });
  });

  it('falls back to the iframe title when the title field is missing (ended live streams)', () => {
    const info = parseOEmbed({ html: '<iframe width="200" title="lofi &amp; beats"></iframe>', type: 'video' });
    expect(info.title).toBe('lofi & beats');
    expect(info.vertical).toBe(false);
  });
});

describe('snippets', () => {
  const input = { id: 'abc12345678', title: 'A <b>"quoted"</b> [title]', imageUrl: 'https://i.ytimg.com/vi/abc12345678/maxresdefault.jpg' };

  it('escapes Markdown alt text', () => {
    expect(markdownSnippet(input)).toBe(
      '[![A <b>"quoted"</b> \\[title\\]](https://i.ytimg.com/vi/abc12345678/maxresdefault.jpg)](https://www.youtube.com/watch?v=abc12345678)',
    );
  });

  it('escapes HTML attributes', () => {
    expect(htmlSnippet({ ...input, width: 1280, height: 720 })).toContain(
      'alt="A &#60;b&#62;&#34;quoted&#34;&#60;/b&#62; [title]" width="1280" height="720"',
    );
  });
});

describe('findContentRect', () => {
  function image(width: number, height: number, paint: (x: number, y: number) => number): ImageData {
    const data = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const v = paint(x, y);
        data.set([v, v, v, 255], (y * width + x) * 4);
      }
    }
    return { width, height, data, colorSpace: 'srgb' } as ImageData;
  }

  it('finds 16:9 content letterboxed in a 4:3 frame', () => {
    // 480×360 with 45px bars, slightly noisy and with a soft edge like a JPEG.
    const img = image(480, 360, (x, y) => (y < 44 || y >= 316 ? (x * y) % 9 : y === 44 || y === 315 ? 40 : 160));
    expect(findContentRect(img)).toEqual({ x: 0, y: 45, width: 480, height: 270 });
  });

  it('finds pillarboxed vertical content and snaps it to 9:16', () => {
    // Content spans 406px (437–842); snapping to 405×720 trims one column, centred.
    const img = image(1280, 720, (x) => (x < 437 || x >= 843 ? 0 : 200));
    expect(findContentRect(img)).toEqual({ x: 438, y: 0, width: 405, height: 720 });
  });

  it('leaves full-frame and mostly dark pictures alone', () => {
    expect(findContentRect(image(320, 180, () => 128))).toBeNull();
    expect(findContentRect(image(320, 180, () => 5))).toBeNull();
    expect(findContentRect(image(320, 180, (_, y) => (y < 30 ? 0 : 200)))).toBeNull();
  });
});
