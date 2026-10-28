import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LoadResult } from '../src/core/fetcher';

/** Per-file CDN responses for the current test; a missing key never settles (still loading). */
let cdn: Record<string, LoadResult | Promise<LoadResult>> = {};

vi.mock('../src/core/fetcher', () => ({
  loadImage: (url: string) => {
    const key = /\/vi\/[\w-]{11}\/(\w+)\.jpg$/.exec(url)![1];
    return Promise.resolve(cdn[key] ?? new Promise(() => {}));
  },
  probeImage: () => Promise.resolve(null),
}));
vi.mock('../src/core/oembed', () => ({
  fetchOEmbed: () => Promise.resolve({ status: 'ok', info: { title: 'T', vertical: false } }),
}));
vi.mock('../src/core/image', async (original) => ({
  ...(await original<typeof import('../src/core/image')>()),
  extractPalette: () => Promise.resolve([]),
}));

const { VideoEntry } = await import('../src/ui/video-entry');

const ok = (key: string, bytes = key): LoadResult => ({
  status: 'ok',
  image: { url: key, blob: new Blob([bytes]), width: 1, height: 1 },
});
const missing: LoadResult = { status: 'missing' };
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  cdn = {};
  globalThis.URL.createObjectURL = () => 'blob:test';
  globalThis.URL.revokeObjectURL = () => {};
});

describe('VideoEntry.best', () => {
  it('waits for larger sizes before calling a smaller one best', async () => {
    let finishMaxres!: (r: LoadResult) => void;
    cdn = {
      maxresdefault: new Promise((resolve) => (finishMaxres = resolve)),
      sddefault: ok('sd'),
      hqdefault: ok('hq'),
      mqdefault: ok('mq'),
      default: ok('default'),
    };
    const entry = new VideoEntry({ kind: 'video', id: 'abcdefghijk' }, () => {});
    entry.open.original = false;
    void entry.start();
    await flush();
    expect(entry.best()).toBeUndefined();
    expect(entry.preview()?.image.url).toBe('sd');

    finishMaxres(ok('maxres'));
    await flush();
    expect(entry.best()?.variant.key).toBe('maxresdefault');
  });

  it('uses hq720 when maxresdefault is missing, and sddefault when both are', async () => {
    cdn = { maxresdefault: missing, hq720: ok('720'), sddefault: ok('sd'), hqdefault: ok('hq'), mqdefault: ok('mq'), default: ok('d') };
    const a = new VideoEntry({ kind: 'video', id: 'abcdefghijk' }, () => {});
    a.open.original = false;
    await a.start();
    expect(a.best()?.variant.key).toBe('hq720');
    expect(a.thumbnails.map((v) => v.key)).toEqual(['maxresdefault', 'hq720', 'sddefault', 'hqdefault', 'mqdefault', 'default']);

    cdn = { ...cdn, hq720: missing };
    const b = new VideoEntry({ kind: 'video', id: 'bcdefghijkl' }, () => {});
    b.open.original = false;
    await b.start();
    expect(b.best()?.variant.key).toBe('sddefault');
  });

  it('reports not found when every thumbnail is missing', async () => {
    cdn = Object.fromEntries(['maxresdefault', 'hq720', 'sddefault', 'hqdefault', 'mqdefault', 'default'].map((k) => [k, missing]));
    const entry = new VideoEntry({ kind: 'video', id: 'abcdefghijk' }, () => {});
    entry.open.original = false;
    await entry.start();
    expect(entry.phase).toBe('notfound');
    expect(entry.best()).toBeUndefined();
  });
});

describe('VideoEntry thumbnail source', () => {
  async function sourceOf(responses: Record<string, LoadResult>) {
    cdn = { maxresdefault: missing, hq720: missing, sddefault: missing, mqdefault: ok('mq'), default: ok('d'), ...responses };
    const entry = new VideoEntry({ kind: 'video', id: 'abcdefghijk' }, () => {});
    entry.open.original = false;
    await entry.start();
    for (let i = 0; i < 5; i++) await flush();
    return entry.source;
  }

  it('recognises an auto frame used as the thumbnail', async () => {
    expect(await sourceOf({ hqdefault: ok('hq', 'same'), hq1: ok('1'), hq2: ok('2', 'same'), hq3: ok('3') })).toEqual({ kind: 'auto', frame: 2 });
  });

  it('calls anything else a custom thumbnail', async () => {
    expect(await sourceOf({ hqdefault: ok('hq', 'upload'), hq1: ok('1'), hq2: ok('2'), hq3: ok('3') })).toEqual({ kind: 'custom' });
  });

  it('says nothing when there are no auto frames (live streams)', async () => {
    expect(await sourceOf({ hqdefault: ok('hq'), hq1: missing, hq2: missing, hq3: missing })).toBeUndefined();
  });
});
