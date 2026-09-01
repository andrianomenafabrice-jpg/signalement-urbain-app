import { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Camera, X } from 'lucide-react';

interface Props {
  onChange: (photo: File | null) => void;
}

export function PhotoUpload({ onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [apercu, setApercu] = useState<string | null>(null);
  const [compression, setCompression] = useState(false);

  async function gererSelection(fichier: File): Promise<void> {
    setCompression(true);
    try {
      const compresse = await imageCompression(fichier, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      });
      onChange(compresse);
      setApercu(URL.createObjectURL(compresse));
    } finally {
      setCompression(false);
    }
  }

  function retirerPhoto(): void {
    onChange(null);
    setApercu(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  if (apercu) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-encre-urbaine/20">
        <img src={apercu} alt="Apercu du signalement" className="w-full h-40 object-cover" />
        <button
          type="button"
          onClick={retirerPhoto}
          className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-encre-urbaine/80 text-beton"
          aria-label="Retirer la photo"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={compression}
      className="w-full h-40 rounded-lg border-2 border-dashed border-encre-urbaine/30 dark:border-beton/30 flex flex-col items-center justify-center gap-2 text-sm"
    >
      <Camera size={28} />
      {compression ? 'Compression en cours…' : 'Ajouter une photo'}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const fichier = e.target.files?.[0];
          if (fichier) void gererSelection(fichier);
        }}
      />
    </button>
  );
}