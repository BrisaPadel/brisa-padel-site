'use client';

import { useEffect } from 'react';

/**
 * Port of the inline <script> in the original HomePage.astro.
 * Runs the exact same DOM work: app-subdomain redirect, language persistence,
 * language-switch interception, and rewriting app links onto the app subdomain.
 */
export default function HomeEffects() {
  useEffect(() => {
    const appSubdomainMatch = location.host.match(/^app\.(.+)\.brisapadel\.com$/);
    if (appSubdomainMatch) {
      const targetHost = `${appSubdomainMatch[1]}.brisapadel.com`;
      location.replace(`${location.protocol}//${targetHost}`);
    }

    const root = document.querySelector('[data-home-root="true"]');
    const langSwitches = document.querySelectorAll('[data-lang-switch="true"]');
    const appLinks = document.querySelectorAll('[data-app-link="true"]');
    if (root) {
      const currentLang = root.getAttribute('data-lang') || 'en';
      try {
        localStorage.setItem('preferred-lang', currentLang);
      } catch {}
    }

    const onLangSwitchClick = (event: Event) => {
      event.preventDefault();
      const langSwitch = event.currentTarget as HTMLElement;
      const targetLang = langSwitch.getAttribute('data-target-lang');
      const targetPath = langSwitch.getAttribute('data-target-path') || '';
      if (!targetLang) return;
      try {
        localStorage.setItem('preferred-lang', targetLang);
      } catch {}
      window.location.assign(targetPath);
    };

    langSwitches.forEach((langSwitch) => {
      langSwitch.addEventListener('click', onLangSwitchClick);
    });

    const appHost = location.host.startsWith('app.') ? location.host : `app.${location.host}`;
    const appBase = `${location.protocol}//${appHost}`;
    appLinks.forEach((link) => {
      const path = link.getAttribute('data-app-path');
      if (!path) return;
      link.setAttribute('href', `${appBase}${path}`);
    });

    return () => {
      langSwitches.forEach((langSwitch) => {
        langSwitch.removeEventListener('click', onLangSwitchClick);
      });
    };
  }, []);

  return null;
}
