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
import { MiseEnPageAuth } from '../components/auth/MiseEnPageAuth';

const schema = z.object({
  email: z.string().trim().toLowerCase().email('Adresse email invalide.'),
  motDePasse: z.string().min(1, 'Mot de passe requis.'),
});

type FormValues = z.infer<typeof schema>;

export function ConnexionPage() {
  const setSession = useAuthStore((etat) => etat.setSession);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onBlur', reValidateMode: 'onChange' });

  async function onSubmit(valeurs: FormValues): Promise<void> {
    try {
      const { data } = await api.post('/auth/login', valeurs);
      setSession(data.user, data.accessToken);
      toast.succes(`Content de te revoir, ${data.user.nom.split(' ')[0]} !`);
      navigate('/');
    } catch (err: any) {
      toast.erreur(err.response?.data?.error?.message ?? 'Connexion impossible.');
    }
  }

  return (
    <MiseEnPageAuth>
      <Helmet>
        <title>Connexion — SignalUrbain</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
        <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Bon retour</p>
        <h1 className="text-3xl font-display font-bold mb-8">Connexion</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <ChampTexte id="email" label="Email" type="email" autoComplete="email" erreur={errors.email?.message} {...register('email')} />
          <ChampTexte id="motDePasse" label="Mot de passe" type="password" autoComplete="current-password" erreur={errors.motDePasse?.message} {...register('motDePasse')} />

          <Bouton type="submit" chargement={isSubmitting} className="w-full mt-2">
            Se connecter
          </Bouton>
        </form>

        <p className="text-sm text-center mt-6 opacity-80">
          Pas de compte ? <Link to="/inscription" className="underline font-medium">Inscris-toi</Link>
        </p>
      </motion.div>
    </MiseEnPageAuth>
  );
}