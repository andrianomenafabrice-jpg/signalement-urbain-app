import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import imageCompression from 'browser-image-compression';
import { Camera, X, ImagePlus } from 'lucide-react';
import { toast } from '../../lib/toast';

interface Props {
  onChange: (photo: File | null) => void;
}

export function PhotoUpload({ onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [apercu, setApercu] = useState<string | null>(null);
  const [compression, setCompression] = useState(false);
  const [survole, setSurvole] = useState(false);

  async function gererSelection(fichier: File): Promise<void> {
    if (!fichier.type.startsWith('image/')) {
      toast.erreur('Le fichier doit etre une image (JPEG, PNG ou WebP).');
      return;
    }

    setCompression(true);
    try {
      const compresse = await imageCompression(fichier, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      });
      onChange(compresse);
      setApercu(URL.createObjectURL(compresse));
    } catch {
      toast.erreur('Impossible de traiter cette image, essaie une autre photo.');
    } finally {
      setCompression(false);
    }
  }

  function retirerPhoto(): void {
    onChange(null);
    setApercu(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  function gererDepot(e: DragEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setSurvole(false);
    const fichier = e.dataTransfer.files?.[0];
    if (fichier) void gererSelection(fichier);
  }

  if (apercu) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-encre-urbaine/20 dark:border-beton/20">
        <img src={apercu} alt="Apercu du signalement" className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <button
          type="button"
          onClick={retirerPhoto}
          className="absolute top-2 right-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-encre-urbaine/80 text-beton backdrop-blur-sm transition-transform active:scale-90 hover:bg-encre-urbaine"
          aria-label="Retirer la photo"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setSurvole(true);
      }}
      onDragLeave={() => setSurvole(false)}
      onDrop={gererDepot}
      disabled={compression}
      className={`w-full h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 text-sm transition-colors ${
        survole
          ? 'border-encre-urbaine dark:border-beton bg-encre-urbaine/5 dark:bg-beton/5'
          : 'border-encre-urbaine/30 dark:border-beton/30'
      }`}
    >
      {compression ? (
        <>
          <ImagePlus size={26} className="animate-pulse" />
          <span>Compression en cours…</span>
        </>
      ) : (
        <>
          <Camera size={26} />
          <span>Ajouter une photo</span>
          <span className="text-xs opacity-50">ou glisse-depose une image</span>
        </>
      )}
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