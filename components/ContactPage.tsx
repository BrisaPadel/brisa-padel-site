'use client';

import { useState } from 'react';
import type { Lang } from '@/data/i18n';
import SubpageHeader from './SubpageHeader';
import { siteUrl } from '@/data/urls';
import styles from './ContactPage.module.css';

interface Props {
  lang: Lang;
}

type FieldName = 'name' | 'email' | 'message';

export default function ContactPage({ lang }: Props) {
  const s = styles.s;
  const returnHomeHref = lang === 'en' ? siteUrl('/home') : siteUrl('/es/home');
  const isSpanish = lang === 'es';
  const requiredMsg = isSpanish ? 'Requerido' : 'Required';
  const emailMsg = isSpanish ? 'Se requiere un correo electrónico válido' : 'A valid email is required';

  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Partial<Record<FieldName, string>> = {};
    let ok = true;

    (['name', 'email', 'message'] as FieldName[]).forEach((field) => {
      const value = String(data.get(field) || '');
      if (!value.trim()) {
        ok = false;
        nextErrors[field] = requiredMsg;
      }
      if (field === 'email' && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        ok = false;
        nextErrors[field] = emailMsg;
      }
    });

    setErrors(nextErrors);
    if (!ok) return;

    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = isSpanish ? `Mensaje de ${name} — brisapadel.com` : `Message from ${name} — brisapadel.com`;
    const body = `${message}\n\n—\n${name}\n${email}`;
    window.location.href = `mailto:hello@brisapadel.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className={`${styles.subpage} ${s}`}>
      <SubpageHeader lang={lang} basePath="/contact" />
      <main className={s}>
        <p className={`${styles.label} ${s}`}>{lang === 'en' ? 'Get in Touch' : 'Contáctanos'}</p>
        <h1 className={s}>{lang === 'en' ? "We'd Love to" : 'Nos Encantaría'}<br className={s} /><em className={s}>{lang === 'en' ? 'Hear From You.' : 'Escucharte.'}</em></h1>
        <p className={`${styles.intro} ${s}`}>{lang === 'en' ? 'Whether you have a question about membership or just want to say hello — our team is here.' : 'Ya sea que tengas una pregunta sobre membresía o simplemente quieras saludar — nuestro equipo está aquí.'}</p>
        <form id="contact-form" className={`${styles.form} ${s}`} noValidate hidden={submitted} onSubmit={handleSubmit}>
          <label className={s}>{`${lang === 'en' ? 'Full Name' : 'Nombre Completo'} *`}</label>
          <input className={s} name="name" type="text" placeholder="Jane Smith" />
          <small className={s} data-err="name">{errors.name ?? ''}</small>

          <label className={s}>{`${lang === 'en' ? 'Email' : 'Correo Electrónico'} *`}</label>
          <input className={s} name="email" type="email" placeholder="jane@example.com" />
          <small className={s} data-err="email">{errors.email ?? ''}</small>

          <label className={s}>{`${lang === 'en' ? 'Message' : 'Mensaje'} *`}</label>
          <textarea className={s} name="message" rows={5} placeholder={lang === 'en' ? 'How can we help you?' : '¿Cómo podemos ayudarte?'}></textarea>
          <small className={s} data-err="message">{errors.message ?? ''}</small>

          <button className={s} type="submit">{lang === 'en' ? 'Send Message' : 'Enviar Mensaje'}</button>
        </form>
        <section id="contact-success" className={`${styles['contact-success']} ${s}`} hidden={!submitted}>
          <h2 className={s}>{lang === 'en' ? 'Message Sent' : 'Mensaje Enviado'}</h2>
          <p className={s}>{lang === 'en' ? "Thank you for reaching out. We'll get back to you within one business day." : 'Gracias por contactarnos. Te responderemos dentro de un día hábil.'}</p>
          <a className={s} href={returnHomeHref}>{lang === 'en' ? 'Return Home' : 'Volver al Inicio'}</a>
        </section>
      </main>
    </div>
  );
}
