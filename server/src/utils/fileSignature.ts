import fs from 'fs/promises';

const SIGNATURES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // "RIFF", le marqueur "WEBP" suit a l'offset 8
};

export async function verifierSignatureImage(cheminFichier: string, mimeAnnonce: string): Promise<boolean> {
  const signature = SIGNATURES[mimeAnnonce];
  if (!signature) return false;

  const handle = await fs.open(cheminFichier, 'r');
  try {
    const buffer = Buffer.alloc(12);
    await handle.read(buffer, 0, 12, 0);

    if (mimeAnnonce === 'image/webp') {
      const estRiff = buffer.subarray(0, 4).equals(Buffer.from(signature));
      const estWebp = buffer.subarray(8, 12).toString('ascii') === 'WEBP';
      return estRiff && estWebp;
    }

    return buffer.subarray(0, signature.length).equals(Buffer.from(signature));
  } finally {
    await handle.close();
  }
}