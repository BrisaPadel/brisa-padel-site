import type { Lang } from '@/data/i18n';
import SubpageHeader from './SubpageHeader';
import { siteUrl, webUrl } from '@/data/urls';
import styles from './MembershipPage.module.css';

interface Props {
  lang: Lang;
}

export default function MembershipPage({ lang }: Props) {
  const s = styles.s;
  const isEs = lang === 'es';
  const requestAccessHref = isEs ? webUrl('/es/request-access') : webUrl('/request-access');
  const contactHref = isEs ? siteUrl('/es/contact') : siteUrl('/contact');

  return (
    <div className={`${styles.subpage} ${s}`}>
      <SubpageHeader lang={lang} basePath="/membership" />
      <main className={s}>
        <p className={`${styles.label} ${s}`}>{isEs ? 'Membresía' : 'Membership'}</p>
        <h1 className={s}>{isEs ? 'Membresía Brisa Padel' : 'Brisa Padel Membership'}</h1>
        <p className={`${styles.intro} ${s}`}>
          {isEs
            ? 'Brisa Padel es una comunidad privada basada en aplicación. Tendrás acceso a matchmaking con IA y partidos semanales de 4 jugadores ajustados a tu nivel, horario y estilo.'
            : 'Brisa Padel is a private, application-based community. Membership gives you access to AI-powered matchmaking and weekly four-player matches based on your skill, schedule, and playing style.'}
        </p>

        <section className={s}>
          <h2 className={s}>{isEs ? 'Para quién es' : 'Who membership is for'}</h2>
          <ul className={s}>
            <li className={s}>{isEs ? 'Juegas pádel al menos dos veces al mes en South Florida.' : 'You play padel at least twice a month in South Florida.'}</li>
            <li className={s}>{isEs ? 'Buscas partidos equilibrados con nuevos compañeros.' : 'You want balanced games and new partners beyond your usual circle.'}</li>
            <li className={s}>{isEs ? 'Eres confiable y cumples los partidos que aceptas.' : 'You are reliable and show up to matches you accept.'}</li>
          </ul>
        </section>

        <section className={s}>
          <h2 className={s}>{isEs ? 'Cómo aplicar' : 'How to apply'}</h2>
          <ol className={s}>
            <li className={s}>{isEs ? 'Completa la solicitud (toma ~5 minutos).' : 'Submit your application (about 5 minutes).'}</li>
            <li className={s}>{isEs ? 'Comparte nivel, lado, frecuencia y clubes preferidos.' : 'Share your level, side preference, frequency, and club preferences.'}</li>
            <li className={s}>{isEs ? 'Espera revisión (normalmente en 48 horas).' : 'Wait for review (most decisions within 48 hours).'}</li>
            <li className={s}>{isEs ? 'Onboarding por WhatsApp si eres aprobado.' : 'Get onboarded over WhatsApp after approval.'}</li>
          </ol>
          <a className={`${styles.cta} ${s}`} href={requestAccessHref}>{isEs ? 'Comenzar solicitud' : 'Start application'}</a>
        </section>

        <section className={s}>
          <h2 className={s}>{isEs ? 'Incluye' : "What's included"}</h2>
          <ul className={s}>
            <li className={s}>{isEs ? 'Sugerencias semanales por WhatsApp.' : 'Weekly match suggestions via WhatsApp.'}</li>
            <li className={s}>{isEs ? 'Tipos de partido: networking, competitivo, money matches, match-lessons.' : 'Match type options: networking, competitive, money matches, match-lessons.'}</li>
            <li className={s}>{isEs ? 'Coordinación automática y rating de nivel (WPR).' : 'AI-handled coordination and skill rating updates (WPR).'}</li>
            <li className={s}>{isEs ? 'Soporte bilingüe (inglés/español).' : 'Bilingual support in English and Spanish.'}</li>
          </ul>
        </section>

        <section className={s}>
          <h2 className={s}>{isEs ? 'Preguntas frecuentes' : 'Frequently asked questions'}</h2>
          <p className={s}><strong className={s}>{isEs ? '¿Necesito jugar en un club específico?' : 'Do I need to be at a specific club?'}</strong>{` ${isEs ? 'No. Coordinamos entre varios clubes.' : 'No. We coordinate across multiple clubs.'}`}</p>
          <p className={s}><strong className={s}>{isEs ? '¿Quién paga la cancha?' : 'Who pays for the court?'}</strong>{` ${isEs ? 'Los jugadores dividen el costo entre ellos.' : 'Court fees are split between players directly.'}`}</p>
          <p className={s}><strong className={s}>{isEs ? '¿Puedo cancelar?' : 'Can I cancel?'}</strong>{` ${isEs ? 'Sí, vía soporte. Revisa términos para detalles.' : 'Yes, through support. See terms for details.'}`}</p>
        </section>

        <section className={s}>
          <h2 className={s}>{isEs ? '¿Listo para aplicar?' : 'Ready to apply?'}</h2>
          <a className={`${styles.cta} ${s}`} href={requestAccessHref}>{isEs ? 'Enviar solicitud' : 'Submit your application'}</a>
          <p className={`${styles.support} ${s}`}>{`${isEs ? '¿Preguntas? Escríbenos.' : 'Questions before applying? Contact us.'} `}<a className={s} href={contactHref}>{isEs ? 'Contacto' : 'Contact'}</a></p>
        </section>
      </main>
    </div>
  );
}
