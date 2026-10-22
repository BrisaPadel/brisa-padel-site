'use client';

import type { Lang } from '@/data/i18n';
import { translations } from '@/data/i18n';
import { siteUrl } from '@/data/urls';
import styles from './SubpageHeader.module.css';

interface Props {
  lang: Lang;
  basePath: '/contact' | '/terms' | '/privacy' | '/about' | '/membership';
}

export default function SubpageHeader({ lang, basePath }: Props) {
  const s = styles.s;
  const t = translations[lang];
  const homeHref = lang === 'en' ? siteUrl('/') : siteUrl('/es/');
  const enHref = siteUrl(basePath);
  const esHref = siteUrl(`/es${basePath}`);

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, targetPath: string) => {
    event.preventDefault();
    window.location.assign(targetPath);
  };

  return (
    <header className={`${styles['sub-head']} ${s}`}>
      <a href={homeHref} className={`${styles.back} ${s}`}>{lang === 'en' ? 'Back' : 'Volver'}</a>
      <div className={`${styles.brand} ${s}`}><span className={s}>|</span><strong className={s}>{`${t.brand} `}<em className={s}>{t.brand2}</em></strong></div>
      <div className={`${styles.lang} ${s}`}>
        <a
          href={enHref}
          data-lang-link="true"
          data-target-path={enHref}
          className={lang === 'en' ? `${s} ${styles.active}` : s}
          onClick={(event) => goTo(event, enHref)}
        >EN</a>
        <a
          href={esHref}
          data-lang-link="true"
          data-target-path={esHref}
          className={lang === 'es' ? `${s} ${styles.active}` : s}
          onClick={(event) => goTo(event, esHref)}
        >ES</a>
      </div>
    </header>
  );
}
