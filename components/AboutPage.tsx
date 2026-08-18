import type { Lang } from '@/data/i18n';
import SubpageHeader from './SubpageHeader';
import { siteUrl } from '@/data/urls';
import styles from './AboutPage.module.css';

interface Props {
  lang: Lang;
}

export default function AboutPage({ lang }: Props) {
  const s = styles.s;
  const isEs = lang === 'es';
  const contactHref = isEs ? siteUrl('/es/contact') : siteUrl('/contact');

  return (
    <div className={`${styles.subpage} ${s}`}>
      <SubpageHeader lang={lang} basePath="/about" />
      <main className={s}>
        <p className={`${styles.label} ${s}`}>{isEs ? 'Quiénes Somos' : 'About Us'}</p>
        <h1 className={s}>{isEs ? 'Sobre Brisa Padel' : 'About Brisa Padel'}</h1>
        <p className={`${styles.intro} ${s}`}>
          {isEs
            ? 'Brisa es una plataforma de matchmaking. Creamos partidos equilibrados cada semana sin coordinación manual.'
            : 'Brisa is a matchmaking platform. We build balanced matches every week without the manual back-and-forth.'}
        </p>

        <section className={s}>
          <h2 className={s}>{isEs ? 'Qué hacemos' : 'What we do'}</h2>
          <p className={s}>{isEs ? 'No somos un club ni vendemos canchas. Coordinamos partidos entre los clubes donde ya juegas.' : "We don't own courts and we don't replace your club. We coordinate matches across the clubs you already play at."}</p>
          <ul className={s}>
            <li className={s}>{isEs ? 'Balance de nivel (WPR)' : 'Skill balance (WPR)'}</li>
            <li className={s}>{isEs ? 'Preferencia de lado (izquierda/derecha/ambos)' : 'Side preference (left/right/both)'}</li>
            <li className={s}>{isEs ? 'Estilo de juego y tipo de partido' : 'Playing style and match type'}</li>
            <li className={s}>{isEs ? 'Preferencia de clubes y disponibilidad semanal' : 'Club preferences and weekly availability'}</li>
          </ul>
        </section>

        <section className={s}>
          <h2 className={s}>{isEs ? 'Cómo somos diferentes' : "How we're different"}</h2>
          <ul className={s}>
            <li className={s}><strong className={s}>WhatsApp-first.</strong>{` ${isEs ? 'Sin app nueva ni contraseñas extra.' : 'No separate app or extra login flow.'}`}</li>
            <li className={s}><strong className={s}>AI-powered.</strong>{` ${isEs ? 'Entiende lenguaje natural en inglés y español.' : 'Availability parsing works in English and Spanish.'}`}</li>
            <li className={s}><strong className={s}>{isEs ? 'Privado y curado.' : 'Private and curated.'}</strong>{` ${isEs ? 'Cada aplicación se revisa manualmente.' : 'Every application is reviewed.'}`}</li>
            <li className={s}><strong className={s}>{isEs ? 'Cross-club.' : 'Cross-club.'}</strong>{` ${isEs ? 'Jugás donde ya jugás.' : 'You keep playing where you already play.'}`}</li>
          </ul>
        </section>

        <section className={s}>
          <h2 className={s}>{isEs ? 'Cobertura' : 'Service area'}</h2>
          <ul className={s}>
            <li className={s}>Miami-Dade County</li>
            <li className={s}>Broward County</li>
            <li className={s}>Palm Beach County</li>
            <li className={s}>Central Florida (Orlando metro)</li>
          </ul>
        </section>

        <section className={s}>
          <h2 className={s}>{isEs ? 'Contacto' : 'Get in touch'}</h2>
          <p className={s}>{isEs ? 'Si eres jugador, coach o club y quieres colaborar, escríbenos.' : "If you're a player, coach, or club interested in working with us, contact us."}</p>
          <a className={`${styles.cta} ${s}`} href={contactHref}>{isEs ? 'Contactar' : 'Contact us'}</a>
        </section>
      </main>
    </div>
  );
}
