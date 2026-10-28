/** Minimal ZIP writer. Entries are stored uncompressed: JPEG, PNG and WebP gain nothing from deflate. */

export interface ZipFile {
  readonly name: string;
  readonly data: Blob | Uint8Array<ArrayBuffer>;
  readonly lastModified?: Date;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosDateTime(d: Date): { time: number; date: number } {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    date: ((Math.max(d.getFullYear(), 1980) - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

/** Renames duplicates to `name (2).ext`, `name (3).ext`, … */
function uniqueNames(files: readonly ZipFile[]): ZipFile[] {
  const used = new Set<string>();
  return files.map((file) => {
    let name = file.name;
    const dot = name.lastIndexOf('.');
    const stem = dot > name.lastIndexOf('/') ? name.slice(0, dot) : name;
    const ext = name.slice(stem.length);
    for (let i = 2; used.has(name.toLowerCase()); i++) name = `${stem} (${i})${ext}`;
    used.add(name.toLowerCase());
    return name === file.name ? file : { ...file, name };
  });
}

export async function createZip(files: readonly ZipFile[]): Promise<Blob> {
  const encoder = new TextEncoder();
  const body: Uint8Array<ArrayBuffer>[] = [];
  const directory: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;

  for (const file of uniqueNames(files)) {
    const data = file.data instanceof Uint8Array ? file.data : new Uint8Array(await file.data.arrayBuffer());
    const name = encoder.encode(file.name);
    const crc = crc32(data);
    const { time, date } = dosDateTime(file.lastModified ?? new Date());

    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true); // version needed to extract
    lv.setUint16(6, 0x0800, true); // UTF-8 file names
    lv.setUint16(8, 0, true); // stored
    lv.setUint16(10, time, true);
    lv.setUint16(12, date, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, data.length, true);
    lv.setUint16(26, name.length, true);
    local.set(name, 30);

    const central = new Uint8Array(46 + name.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, time, true);
    cv.setUint16(14, date, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, name.length, true);
    cv.setUint32(42, offset, true);
    central.set(name, 46);

    body.push(local, data);
    directory.push(central);
    offset += local.length + data.length;
  }

  const directorySize = directory.reduce((n, entry) => n + entry.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, directory.length, true);
  ev.setUint16(10, directory.length, true);
  ev.setUint32(12, directorySize, true);
  ev.setUint32(16, offset, true);

  return new Blob([...body, ...directory, end], { type: 'application/zip' });
}
