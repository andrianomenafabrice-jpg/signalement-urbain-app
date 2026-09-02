import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { X, MapPin, Tag, FileText, Camera } from 'lucide-react';
import { CATEGORIES } from '../../lib/categories';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useCreerSignalement } from '../../hooks/useReports';
import { PhotoUpload } from './PhotoUpload';
import { SelecteurPosition } from './SelecteurPosition';
import { Bouton } from '../ui/Bouton';

const CENTRE_PAR_DEFAUT = { latitude: -18.8792, longitude: 47.5079 };

const schema = z.object({
  titre: z.string().trim().min(3, 'Le titre doit contenir au moins 3 caracteres.').max(120),
  description: z.string().trim().min(10, 'Decris le probleme en quelques mots de plus.'),
  categorie: z.enum(['voirie', 'eclairage', 'dechets', 'eau', 'autre'], {
    errorMap: () => ({ message: 'Choisis une categorie.' }),
  }),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onFerme: () => void;
  onCree: () => void;
}

export function FormulaireSignalement({ onFerme, onCree }: Props) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [position, setPosition] = useState(CENTRE_PAR_DEFAUT);
  const geolocation = useGeolocation();
  const creerSignalement = useCreerSignalement();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onBlur', reValidateMode: 'onChange' });

  useEffect(() => {
    geolocation.demanderPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (geolocation.statut === 'succes' && geolocation.latitude && geolocation.longitude) {
      setPosition({ latitude: geolocation.latitude, longitude: geolocation.longitude });
    }
  }, [geolocation.statut, geolocation.latitude, geolocation.longitude]);

  useEffect(() => {
    function gererEchap(e: KeyboardEvent): void {
      if (e.key === 'Escape') onFerme();
    }
    window.addEventListener('keydown', gererEchap);
    return () => window.removeEventListener('keydown', gererEchap);
  }, [onFerme]);

  async function onSubmit(valeurs: FormValues): Promise<void> {
    if (!photo) return;
    await creerSignalement.mutateAsync({
      ...valeurs,
      latitude: position.latitude,
      longitude: position.longitude,
      photo,
    });
    onCree();
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onFerme}
        className="fixed inset-0 z-[999] bg-encre-urbaine/50 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        className="fixed inset-x-0 bottom-0 z-[1000] max-h-[92vh] overflow-y-auto rounded-t-2xl bg-beton dark:bg-bitume p-5 pt-3 shadow-2xl"
      >
        <div className="flex justify-center mb-3">
          <span className="w-10 h-1.5 rounded-full bg-encre-urbaine/15 dark:bg-beton/15" />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-display font-bold">Signaler un probleme</h2>
          <button
            type="button"
            onClick={onFerme}
            aria-label="Fermer"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors hover:bg-encre-urbaine/5 dark:hover:bg-beton/5"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-2" htmlFor="titre">
              <FileText size={14} className="opacity-60" />
              Titre
            </label>
            <input
              id="titre"
              {...register('titre')}
              placeholder="Ex. Nid de poule Avenue de l'Independance"
              className={`w-full min-h-[46px] px-3.5 rounded-lg bg-transparent border transition-colors focus:outline-none focus:ring-2 ${
                errors.titre
                  ? 'border-signal-erreur focus:ring-signal-erreur/30'
                  : 'border-encre-urbaine/25 dark:border-beton/25 focus:ring-encre-urbaine/20 dark:focus:ring-beton/20'
              }`}
            />
            {errors.titre && <p className="text-sm text-signal-erreur mt-1.5">{errors.titre.message}</p>}
          </div>

          <div>
            <span className="flex items-center gap-1.5 text-sm font-medium mb-2">
              <Tag size={14} className="opacity-60" />
              Categorie
            </span>
            <Controller
              control={control}
              name="categorie"
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const actif = field.value === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => field.onChange(cat.id)}
                        className={`min-h-[68px] rounded-lg border flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all active:scale-[0.96] ${
                          actif
                            ? `${cat.couleur} text-beton border-transparent shadow-md`
                            : 'border-encre-urbaine/25 dark:border-beton/25 hover:border-encre-urbaine/50 dark:hover:border-beton/50'
                        }`}
                      >
                        <cat.icone size={22} />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.categorie && <p className="text-sm text-signal-erreur mt-1.5">{errors.categorie.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-2" htmlFor="description">
              <FileText size={14} className="opacity-60" />
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              placeholder="Que se passe-t-il exactement ?"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-transparent border transition-colors focus:outline-none focus:ring-2 resize-none ${
                errors.description
                  ? 'border-signal-erreur focus:ring-signal-erreur/30'
                  : 'border-encre-urbaine/25 dark:border-beton/25 focus:ring-encre-urbaine/20 dark:focus:ring-beton/20'
              }`}
            />
            {errors.description && <p className="text-sm text-signal-erreur mt-1.5">{errors.description.message}</p>}
          </div>

          <div>
            <span className="flex items-center gap-1.5 text-sm font-medium mb-2">
              <Camera size={14} className="opacity-60" />
              Photo
            </span>
            <PhotoUpload onChange={setPhoto} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <MapPin size={14} className="opacity-60" />
                Position
              </span>
              <span className="font-mono text-xs tabular-nums opacity-70">
                {geolocation.statut === 'chargement' && 'Localisation…'}
                {geolocation.statut === 'succes' && 'Position detectee'}
                {(geolocation.statut === 'refuse' || geolocation.statut === 'erreur') && 'Touche la carte pour placer le point'}
              </span>
            </div>
            <SelecteurPosition
              latitude={position.latitude}
              longitude={position.longitude}
              onChange={(lat, lon) => setPosition({ latitude: lat, longitude: lon })}
            />
          </div>

          <Bouton type="submit" chargement={creerSignalement.isPending} disabled={!photo} className="w-full">
            Envoyer le signalement
          </Bouton>
          {!photo && <p className="text-xs text-center opacity-60">Une photo est requise avant l'envoi.</p>}
        </form>
      </motion.div>
    </>
  );
}