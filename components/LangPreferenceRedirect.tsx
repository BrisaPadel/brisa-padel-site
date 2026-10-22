'use client';

import { useEffect } from 'react';

/**
 * Port of the inline <script> in the original index.astro:
 * send visitors who previously chose Spanish to /es/.
 */
export default function LangPreferenceRedirect() {
  useEffect(() => {
    try {
      const preferred = localStorage.getItem('preferred-lang');
      if (preferred === 'es') {
        window.location.replace('/es/');
      }
    } catch {}
  }, []);

  return null;
}
