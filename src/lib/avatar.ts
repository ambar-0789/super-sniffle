// Deterministic pixel avatar from name hash
const PALETTES = [
  ['#ff6b6b', '#ff9f9f', '#4a0000'],
  ['#48dbfb', '#a8f0ff', '#003060'],
  ['#ff9f43', '#ffd08a', '#5a2800'],
  ['#2ed573', '#a8ffcc', '#003020'],
  ['#a29bfe', '#d8d0ff', '#1a0060'],
  ['#fd79a8', '#ffb8d4', '#500030'],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function drawAvatar(canvas: HTMLCanvasElement, name: string, size = 32) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = size;
  canvas.height = size;
  const px = Math.floor(size / 8);
  const h = hash(name);
  const palette = PALETTES[h % PALETTES.length];
  const grid: boolean[][] = Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => {
      const col = c < 4 ? c : 7 - c;
      return !!((h >> (r * 4 + col)) & 1);
    })
  );

  ctx.fillStyle = palette[2];
  ctx.fillRect(0, 0, size, size);

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (grid[r][c]) {
        ctx.fillStyle = (r + c) % 2 === 0 ? palette[0] : palette[1];
        ctx.fillRect(c * px, r * px, px, px);
      }
    }
  }
}
