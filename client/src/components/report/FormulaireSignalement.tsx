import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../lib/categories';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useCreerSignalement } from '../../hooks/useReports';
import { PhotoUpload } from './PhotoUpload';
import { SelecteurPosition } from './SelecteurPosition';

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
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    geolocation.demanderPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (geolocation.statut === 'succes' && geolocation.latitude && geolocation.longitude) {
      setPosition({ latitude: geolocation.latitude, longitude: geolocation.longitude });
    }
  }, [geolocation.statut, geolocation.latitude, geolocation.longitude]);

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
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'tween', duration: 0.25 }}
      className="fixed inset-x-0 bottom-0 z-[1000] max-h-[92vh] overflow-y-auto rounded-t-2xl bg-beton dark:bg-bitume p-5 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold">Signaler un probleme</h2>
        <button type="button" onClick={onFerme} aria-label="Fermer" className="min-w-[44px] min-h-[44px] flex items-center justify-center">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="titre">Titre</label>
          <input
            id="titre"
            {...register('titre')}
            placeholder="Ex. Nid de poule Avenue de l'Independance"
            className="w-full min-h-[44px] px-3 rounded-lg border border-encre-urbaine/30 dark:border-beton/30 bg-transparent"
          />
          {errors.titre && <p className="text-sm text-marquage-voirie mt-1">{errors.titre.message}</p>}
        </div>

        <div>
          <span className="block text-sm font-medium mb-2">Categorie</span>
          <Controller
            control={control}
            name="categorie"
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => field.onChange(cat.id)}
                    className={`min-h-[64px] rounded-lg border flex flex-col items-center justify-center gap-1 text-xs ${
                      field.value === cat.id
                        ? `${cat.couleur} text-beton border-transparent`
                        : 'border-encre-urbaine/30 dark:border-beton/30'
                    }`}
                  >
                    <cat.icone size={22} />
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          />
          {errors.categorie && <p className="text-sm text-marquage-voirie mt-1">{errors.categorie.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            placeholder="Que se passe-t-il exactement ?"
            className="w-full px-3 py-2 rounded-lg border border-encre-urbaine/30 dark:border-beton/30 bg-transparent"
          />
          {errors.description && <p className="text-sm text-marquage-voirie mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <span className="block text-sm font-medium mb-2">Photo</span>
          <PhotoUpload onChange={setPhoto} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Position</span>
            <span className="font-mono text-xs tabular-nums">
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

        {creerSignalement.isError && (
          <p className="text-sm text-marquage-voirie">Une erreur est survenue, reessaie dans un instant.</p>
        )}

        <button
          type="submit"
          disabled={!photo || creerSignalement.isPending}
          className="w-full min-h-[48px] rounded-lg bg-encre-urbaine text-beton dark:bg-beton dark:text-bitume font-medium disabled:opacity-50"
        >
          {creerSignalement.isPending ? 'Envoi en cours…' : 'Envoyer le signalement'}
        </button>
        {!photo && <p className="text-xs text-center opacity-70">Une photo est requise avant l'envoi.</p>}
      </form>
    </motion.div>
  );
}