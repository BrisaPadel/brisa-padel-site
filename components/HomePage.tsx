import type { Lang } from '@/data/i18n';
import { HERO_IMG, translations } from '@/data/i18n';
import { siteUrl, webUrl } from '@/data/urls';
import HomeEffects from './HomeEffects';
import styles from './HomePage.module.css';

interface Props {
  lang: Lang;
}

/** `s` is the component scope class — the CSS Modules equivalent of Astro's data-astro-cid. */
export default function HomePage({ lang }: Props) {
  const s = styles.s;
  const t = translations[lang];
  const enHref = siteUrl('/');
  const esHref = siteUrl('/es/');
  const loginHref = webUrl('/login');
  const requestAccessPath = lang === 'en' ? '/request-access' : '/es/request-access';
  const localizedRequestAccess = lang === 'en' ? webUrl('/request-access') : webUrl('/es/request-access');
  const localizedContact = lang === 'en' ? siteUrl('/contact') : siteUrl('/es/contact');
  const localizedTerms = lang === 'en' ? siteUrl('/terms') : siteUrl('/es/terms');
  const localizedPrivacy = lang === 'en' ? siteUrl('/privacy') : siteUrl('/es/privacy');

  return (
    <div className={`${styles['home-root']} ${s}`} data-home-root="true" data-lang={lang}>
      <HomeEffects />
      <div className={`${styles['hero-bg']} ${s}`} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s} src={HERO_IMG} alt={t.altHero} loading="eager" fetchPriority="high" />
        <div className={`${styles['hero-overlay']} ${s}`}></div>
      </div>

      <div className={`${styles['login-wrap']} ${s}`}>
        <a className={`${styles['login-btn']} ${s}`} href={loginHref} data-app-link="true" data-app-path="/login">
          <svg className={s} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path className={s} d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle className={s} cx="12" cy="7" r="4"></circle>
          </svg>
          {t.login}
        </a>
      </div>

      <div className={`${styles['lang-switch']} ${s}`} role="group" aria-label={t.language}>
        <a
          className={`${styles['lang-btn']} ${s}${lang === 'en' ? ` ${styles.active}` : ''}`}
          href={enHref}
          data-lang-switch="true"
          data-target-lang="en"
          data-target-path={enHref}
        >
          EN
        </a>
        <a
          className={`${styles['lang-btn']} ${s}${lang === 'es' ? ` ${styles.active}` : ''}`}
          href={esHref}
          data-lang-switch="true"
          data-target-lang="es"
          data-target-path={esHref}
        >
          ES
        </a>
      </div>

      <main className={`${styles['hero-content']} ${s}`}>
        <div className={`${styles.wordmark} ${s}`} aria-label="Brisa Padel">
          <span className={s}>|</span>
          <strong className={s}>{`${t.brand} `}<em className={s}>{t.brand2}</em></strong>
          <span className={s}>|</span>
        </div>

        <h1 className={s}>{t.homeHeadline1}<br className={s} /><em className={s}>{t.homeHeadline2}</em></h1>
        <p className={s}>{t.homeSub}</p>
        <a className={`${styles.cta} ${s}`} href={localizedRequestAccess} data-app-link="true" data-app-path={requestAccessPath}>{t.homeCta}</a>
      </main>

      <footer className={s}>
        <a className={s} href={lang === 'en' ? siteUrl('/about') : siteUrl('/es/about')}>{lang === 'en' ? 'About' : 'Nosotros'}</a>
        <span className={s}>|</span>
        <a className={s} href={localizedContact}>{t.homeContact}</a>
        <span className={s}>|</span>
        <a className={s} href={localizedTerms}>{t.homeTerms}</a>
        <span className={s}>|</span>
        <a className={s} href={localizedPrivacy}>{t.homePrivacy}</a>
      </footer>
    </div>
  );
}
