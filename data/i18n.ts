export type Lang = 'en' | 'es';

export const translations = {
  en: {
    pageTitle: 'Brisa Padel | Padel Scheduling Made Easy',
    pageDescription: "Miami's premier padel match-making app.",
    brand: 'Brisa',
    brand2: 'Padel',
    homeHeadline1: 'Padel Scheduling',
    homeHeadline2: 'Made Easy.',
    homeSub: "Miami's premier padel match-making app",
    homeCta: 'Request Access',
    homeContact: 'Contact',
    homeTerms: 'Terms',
    homePrivacy: 'Privacy',
    login: 'Log In',
    language: 'Language',
    altHero: 'Brisa Padel court at golden hour'
  },
  es: {
    pageTitle: 'Brisa Padel | Organiza tu Pádel Fácilmente',
    pageDescription: 'La app de emparejamiento de pádel premium de Miami.',
    brand: 'Brisa',
    brand2: 'Padel',
    homeHeadline1: 'Organiza tu Pádel',
    homeHeadline2: 'Fácilmente.',
    homeSub: 'La app de emparejamiento de pádel premium de Miami',
    homeCta: 'Solicitar Acceso',
    homeContact: 'Contacto',
    homeTerms: 'Términos',
    homePrivacy: 'Privacidad',
    login: 'Iniciar Sesión',
    language: 'Idioma',
    altHero: 'Cancha de Brisa Padel al atardecer'
  }
} as const;

// Served from public/. The CloudFront bucket this used to load from returns
// 403 AccessDenied, so the asset lives in the repo rather than off a URL that
// can stop resolving without anything here changing.
export const HERO_IMG = 'https://app.brisapadel.com/hero-main.jpg';
