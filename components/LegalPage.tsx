import type { Lang } from '@/data/i18n';
import SubpageHeader from './SubpageHeader';
import styles from './LegalPage.module.css';

interface Props {
  lang: Lang;
  kind: 'terms' | 'privacy';
  sections: { title: string; body: string }[];
}

export default function LegalPage({ lang, kind, sections }: Props) {
  const s = styles.s;
  const title = kind === 'terms'
    ? (lang === 'en' ? 'Terms of Service' : 'Términos y Condiciones')
    : (lang === 'en' ? 'Privacy Policy' : 'Política de Privacidad');
  const updated = lang === 'en' ? 'Last updated: March 8, 2026' : 'Última actualización: 8 de marzo de 2026';
  const basePath = kind === 'terms' ? '/terms' : '/privacy';

  return (
    <div className={`${styles.subpage} ${s}`}>
      <SubpageHeader lang={lang} basePath={basePath} />
      <main className={s}>
        <p className={`${styles.label} ${s}`}>Legal</p>
        <h1 className={s}>{title}</h1>
        <p className={`${styles.meta} ${s}`}>Kapur Capital LLC d/b/a Brisa Padel</p>
        <p className={`${styles.meta} ${styles.m2} ${s}`}>{updated}</p>
        <div className={`${styles.sections} ${s}`}>
          {sections.map((section) => (
            <section className={s} key={section.title}>
              <h2 className={s}>{section.title}</h2>
              <p className={s}>{section.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
