import { describe, expect, it } from 'vitest';
import { extractTargets, parseTarget } from '../src/core/parse';

const ID = 'dQw4w9WgXcQ';

describe('parseTarget', () => {
  it.each([
    [ID],
    [`https://www.youtube.com/watch?v=${ID}`],
    [`https://youtube.com/watch?v=${ID}&t=42s&list=PL123`],
    [`https://m.youtube.com/watch?app=desktop&v=${ID}`],
    [`https://music.youtube.com/watch?v=${ID}&si=abc`],
    [`https://youtu.be/${ID}`],
    [`https://youtu.be/${ID}?si=share&t=10`],
    [`youtu.be/${ID}`],
    [`www.youtube.com/watch?v=${ID}`],
    [`https://www.youtube.com/shorts/${ID}`],
    [`https://www.youtube.com/live/${ID}?feature=share`],
    [`https://www.youtube.com/embed/${ID}?start=30`],
    [`https://www.youtube-nocookie.com/embed/${ID}`],
    [`https://www.youtube.com/v/${ID}`],
    [`https://www.youtube.com/e/${ID}`],
    [`https://youtube.googleapis.com/v/${ID}`],
    [`https://www.youtube.com/attribution_link?a=x&u=%2Fwatch%3Fv%3D${ID}%26feature%3Dshare`],
    [`https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${ID}`],
    [`https://i.ytimg.com/vi/${ID}/maxresdefault.jpg`],
    [`https://i9.ytimg.com/vi_webp/${ID}/hqdefault.webp`],
    [`https://img.youtube.com/vi/${ID}/0.jpg`],
    [`<https://youtu.be/${ID}>`],
    [`(https://youtu.be/${ID}).`],
  ])('finds the video in %s', (input) => {
    expect(parseTarget(input)).toEqual({ kind: 'video', id: ID });
  });

  it.each([
    ['https://www.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI', 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI'],
    ['https://www.youtube.com/embed/videoseries?list=PL0123456789', 'PL0123456789'],
    ['https://music.youtube.com/playlist?list=OLAK5uy_abc-DEF', 'OLAK5uy_abc-DEF'],
  ])('finds the playlist in %s', (input, listId) => {
    expect(parseTarget(input)).toEqual({ kind: 'playlist', listId });
  });

  it('prefers the video when a link has both v and list', () => {
    expect(parseTarget(`https://www.youtube.com/watch?v=${ID}&list=PL0123456789`)).toEqual({ kind: 'video', id: ID });
  });

  it.each([
    [''],
    ['   '],
    ['hello world'],
    ['https://example.com/watch?v=dQw4w9WgXcQ'],
    ['https://www.youtube.com/@RickAstleyYT'],
    ['https://www.youtube.com/watch?v=short'],
    ['https://youtu.be/'],
    ['dQw4w9WgXc'],
    ['dQw4w9WgXcQQ'],
  ])('rejects %j', (input) => {
    expect(parseTarget(input)).toBeNull();
  });
});

describe('extractTargets', () => {
  it('reads one link per line, comma separated or mixed with text, without duplicates', () => {
    const text = [
      `Check https://youtu.be/${ID} and also`,
      'https://www.youtube.com/shorts/0HAETg7L15o,https://youtu.be/jNQXAC9IVRw',
      `https://www.youtube.com/watch?v=${ID}`,
      'https://www.youtube.com/playlist?list=PL0123456789',
    ].join('\n');
    expect(extractTargets(text)).toEqual([
      { kind: 'video', id: ID },
      { kind: 'video', id: '0HAETg7L15o' },
      { kind: 'video', id: 'jNQXAC9IVRw' },
      { kind: 'playlist', listId: 'PL0123456789' },
    ]);
  });

  it('accepts a bare ID on its own', () => {
    expect(extractTargets('  jNQXAC9IVRw  ')).toEqual([{ kind: 'video', id: 'jNQXAC9IVRw' }]);
    expect(extractTargets('programming')).toEqual([{ kind: 'video', id: 'programming' }]);
  });

  it('ignores 11-letter words in longer text but keeps ID-looking tokens', () => {
    expect(extractTargets('programming tutorial dQw4w9WgXcQ')).toEqual([{ kind: 'video', id: ID }]);
  });
});
