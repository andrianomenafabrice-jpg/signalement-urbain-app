import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { toast } from '../lib/toast';
import { Bouton } from '../components/ui/Bouton';
import { ChampTexte } from '../components/auth/ChampTexte';
import { IndicateurForce } from '../components/auth/IndicateurForce';
import { MiseEnPageAuth } from '../components/auth/MiseEnPageAuth';

const schema = z.object({
  nom: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caracteres.'),
  email: z.string().trim().toLowerCase().email('Adresse email invalide.'),
  motDePasse: z.string().min(8, 'Au moins 8 caracteres.'),
});

type FormValues = z.infer<typeof schema>;

export function InscriptionPage() {
  const setSession = useAuthStore((etat) => etat.setSession);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onBlur', reValidateMode: 'onChange' });

  const motDePasse = watch('motDePasse', '');

  async function onSubmit(valeurs: FormValues): Promise<void> {
    try {
      const { data } = await api.post('/auth/register', valeurs);
      setSession(data.user, data.accessToken);
      toast.succes(`Bienvenue, ${data.user.nom.split(' ')[0]} !`);
      navigate('/');
    } catch (err: any) {
      toast.erreur(err.response?.data?.error?.message ?? 'Inscription impossible.');
    }
  }

  return (
    <MiseEnPageAuth>
      <Helmet>
        <title>Inscription — SignalUrbain</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
        <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Premiere visite</p>
        <h1 className="text-3xl font-display font-bold mb-8">Creer un compte</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <ChampTexte id="nom" label="Nom" autoComplete="name" erreur={errors.nom?.message} {...register('nom')} />
          <ChampTexte id="email" label="Email" type="email" autoComplete="email" erreur={errors.email?.message} {...register('email')} />
          <div>
            <ChampTexte id="motDePasse" label="Mot de passe" type="password" autoComplete="new-password" erreur={errors.motDePasse?.message} {...register('motDePasse')} />
            <IndicateurForce motDePasse={motDePasse} />
          </div>

          <Bouton type="submit" chargement={isSubmitting} className="w-full mt-2">
            Creer mon compte
          </Bouton>
        </form>

        <p className="text-sm text-center mt-6 opacity-80">
          Deja inscrit ? <Link to="/connexion" className="underline font-medium">Connecte-toi</Link>
        </p>
      </motion.div>
    </MiseEnPageAuth>
  );
}