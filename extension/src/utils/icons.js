// Brand keywords in priority order
const BRAND_KEYWORDS = {
  github: ['github', 'gh_', 'ghp_'],
  gitlab: ['gitlab', 'glpat-'],
  aws: ['aws', 'akia', 'akia2'],
  google: ['google', 'oauth', 'gcloud'],
  openai: ['openai', 'sk-', 'chatgpt'],
  stripe: ['stripe', 'sk_live', 'sk_test'],
  vercel: ['vercel', 'vercel_'],
  heroku: ['heroku'],
  netlify: ['netlify'],
  firebase: ['firebase'],
  postgres: ['postgres', 'postgresql', 'pg:', 'psql'],
  mysql: ['mysql'],
  mongodb: ['mongodb', 'mongo'],
  slack: ['slack', 'xoxb', 'xoxp'],
  discord: ['discord', 'discord.com'],
  twilio: ['twilio'],
  sendgrid: ['sendgrid', 'sg.'],
  shopify: ['shopify'],
  paypal: ['paypal'],
  notion: ['notion'],
  airtable: ['airtable'],
  supabase: ['supabase'],
  copilot: ['copilot', 'gh_copilot'],
  ssh: ['ssh', 'ubuntu@', 'ec2-', 'pem'],
};

const CATEGORY_ICONS = {
  'API Keys': 'api',
  'Tokens': 'token',
  'SSH Commands': 'ssh',
  'Database URLs': 'database',
  'Passwords': 'lock',
  'Environment Variables': 'env',
  'AI Prompts': 'ai',
  'Code Snippets': 'code',
};

export function getSnippetIcon(name, category) {
  if (!name) return 'snipy';

  const nameLower = name.toLowerCase();

  // Check brand keywords first
  for (const [brand, keywords] of Object.entries(BRAND_KEYWORDS)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        return brand;
      }
    }
  }

  // Check category
  if (category && CATEGORY_ICONS[category]) {
    return CATEGORY_ICONS[category];
  }

  // Default Snipy icon
  return 'snipy';
}

export const BRAND_ICONS = {
  snipy: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="14" width="20" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="4" y="9" width="20" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="2" y="4" width="20" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 11l-2 3 2 3M20 11l2 3-2 3M14 7v8" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  </svg>`,

  github: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2C8.27 2 2 8.27 2 16c0 6.16 4 11.42 9.57 12.87.7.13.96-.3.96-.67v-2.37c-3.89.85-4.72-1.88-4.72-1.88-.64-1.62-1.56-2.05-1.56-2.05-1.27-.87.1-.85.1-.85 1.4.1 2.14 1.44 2.14 1.44 1.25 2.14 3.28 1.52 4.08 1.16.13-.9.49-1.52.89-1.87-3.1-.35-6.37-1.55-6.37-6.9 0-1.52.54-2.77 1.44-3.74-.15-.35-.62-1.77.13-3.69 0 0 1.17-.37 3.83 1.43 1.11-.31 2.3-.46 3.49-.47 1.18.01 2.38.16 3.5.47 2.65-1.8 3.82-1.43 3.82-1.43.75 1.92.28 3.34.14 3.69.9.97 1.43 2.22 1.43 3.74 0 5.37-3.28 6.54-6.4 6.88.5.43.95 1.29.95 2.6v3.86c0 .37.25.81.97.67C26 27.4 30 22.16 30 16c0-7.73-6.27-14-14-14z"/>
  </svg>`,

  gitlab: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M28.98 13.5l-1.94-5.95a1.08 1.08 0 0 0-1.03-.65h-.02a1.08 1.08 0 0 0-1.03.65L22.02 13.5H9.98L6.04 7.55a1.08 1.08 0 0 0-1.03-.65h-.02a1.08 1.08 0 0 0-1.03.65L.02 13.5a1.62 1.62 0 0 0 .59 1.82l13.4 9.74.03.02.03.02 13.4-9.74a1.62 1.62 0 0 0 .59-1.82l-.08-.06z"/>
  </svg>`,

  aws: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.58 16.85c0 .6.48 1.08 1.08 1.08.6 0 1.08-.48 1.08-1.08s-.48-1.08-1.08-1.08c-.6 0-1.08.48-1.08 1.08zm11.66-3.6c.48 0 .95.35 1.02.83l.96 6.72c.1.6-.35 1.15-.97 1.15h-.83c-.55 0-.98-.42-1.06-.97l-.73-5.16-.9 5.16c-.08.55-.51.97-1.06.97h-.5c-.55 0-.98-.42-1.06-.97l-.9-5.16-.73 5.16c-.08.55-.51.97-1.06.97h-.83c-.62 0-1.07-.55-.97-1.15l.96-6.72c.07-.48.54-.83 1.02-.83h.83c.55 0 .98.42 1.06.97l.73 4.88.88-4.88c.08-.55.51-.97 1.06-.97h.83z"/>
  </svg>`,

  openai: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M27.73 15.98c0-2.75-.71-5.38-2.06-7.64.85-1.29 1.35-2.83 1.35-4.48 0-4.42-3.58-8-8-8-2.32 0-4.4.99-5.87 2.58C10.85 1.9 8.71 2 6.27 2 2.7 2 0 4.7 0 8.27c0 2.43.99 4.64 2.58 6.24C1.89 16.76 1.12 18.81 1.12 21.05c0 4.4 3.58 8 8 8 2.32 0 4.41-.99 5.87-2.58 1.48 1.59 3.62 2.58 6.05 2.58 4.42 0 8-3.58 8-8 0-2.25-.76-4.32-2.04-5.95 1.34-2.27 2.06-4.9 2.06-7.65z"/>
  </svg>`,

  stripe: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm-2 19c0 .55-.45 1-1 1s-1-.45-1-1v-6c0-.55.45-1 1-1s1 .45 1 1v6zm7-3c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"/>
  </svg>`,

  vercel: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2L2 28h28L16 2z"/>
  </svg>`,

  ssh: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 10h20v12H6z"/>
    <path d="M10 22v2M16 22v2M22 22v2"/>
    <path d="M2 4l4 4M30 4l-4 4"/>
  </svg>`,

  database: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8c0-2.21 4.48-4 10-4s10 1.79 10 4v8c0 2.21-4.48 4-10 4s-10-1.79-10-4V8z"/>
    <path d="M6 16c0 2.21 4.48 4 10 4s10-1.79 10-4"/>
    <path d="M6 24c0 2.21 4.48 4 10 4s10-1.79 10-4"/>
  </svg>`,

  token: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="12"/>
    <path d="M16 10v12M10 16h12"/>
  </svg>`,

  lock: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 14v-4c0-3.31 2.69-6 6-6s6 2.69 6 6v4M6 14h20v12H6z"/>
    <circle cx="16" cy="20" r="2"/>
  </svg>`,

  api: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8l4 6-4 6M26 8l-4 6 4 6M14 4l-4 24"/>
  </svg>`,

  code: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 8l-4 8 4 8M22 8l4 8-4 8M18 6l-4 20"/>
  </svg>`,
};

export function renderIcon(iconName, size = 24) {
  const svg = BRAND_ICONS[iconName] || BRAND_ICONS.snipy;
  const div = document.createElement('div');
  div.innerHTML = svg;
  const element = div.firstElementChild;
  element.setAttribute('width', size);
  element.setAttribute('height', size);
  element.style.color = 'currentColor';
  return element;
}
