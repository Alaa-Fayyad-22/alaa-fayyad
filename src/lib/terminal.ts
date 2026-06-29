import { projects, experiences, skillCategories } from '../data/portfolio';

/**
 * Pure command engine for the interactive hero terminal. Framework-free so the
 * component stays lean: given a typed line + a small localized context, it
 * returns the output lines to print, plus an optional side-effect `action`
 * (open a link / scroll to a section) that the component performs. All copy is
 * pulled from the real portfolio data so responses stay accurate and bilingual.
 */

export type Tone = 'cmd' | 'out' | 'accent' | 'muted' | 'name' | 'ok' | 'err';
export type OutputLine = { text: string; tone?: Tone; href?: string };
export type Action = { type: 'open'; href: string } | { type: 'scroll'; id: string };
export type CommandResult = { lines: OutputLine[]; action?: Action } | { clear: true };

export type TermContext = {
  locale: 'en' | 'ar';
  name: string;
  role: string;
  status: string;
  bio: string[];
  location: string;
};

const CONTACT = {
  email: 'alaafayyadp1@gmail.com',
  whatsapp: 'https://wa.me/9613748496',
  linkedin: 'https://www.linkedin.com/in/alaa-fayyad',
  github: 'https://github.com/Alaa-Fayyad-22',
};
const RESUME = '/Alaa_Fayyad_CV.pdf';

/** name -> short description, shown by `help`. */
const COMMANDS: [string, string][] = [
  ['help', 'show this list of commands'],
  ['whoami', 'who is Alaa'],
  ['about', 'a short bio'],
  ['skills', 'tech stack & tools'],
  ['projects', 'list projects + jump to them'],
  ['experience', 'work history'],
  ['contact', 'contact info + jump to it'],
  ['email', 'open a new email to me'],
  ['github', 'open my GitHub ↗'],
  ['linkedin', 'open my LinkedIn ↗'],
  ['resume', 'open my résumé / cv ↗'],
  ['clear', 'clear the terminal'],
];

const pad = (s: string, n: number) => (s.length >= n ? s + ' ' : s + ' '.repeat(n - s.length));

export function runCommand(raw: string, ctx: TermContext): CommandResult {
  const input = raw.trim().replace(/\s+/g, ' ');
  const cmd = input.toLowerCase();
  const L = ctx.locale === 'ar';

  // Empty line: just a fresh prompt, no output.
  if (cmd === '') return { lines: [] };

  switch (true) {
    case cmd === 'help':
      return {
        lines: [
          { text: 'available commands:', tone: 'accent' },
          ...COMMANDS.map(([n, d]) => ({ text: `  ${pad(n, 11)}${d}`, tone: 'out' as Tone })),
          { text: "tip: try 'projects', 'email', or 'resume' — or just scroll down.", tone: 'muted' },
        ],
      };

    case cmd === 'whoami':
      return {
        lines: [
          { text: ctx.name, tone: 'name' },
          { text: ctx.role, tone: 'out' },
          { text: ctx.status, tone: 'ok' },
        ],
      };

    case cmd === 'about':
      return { lines: ctx.bio.map(b => ({ text: b, tone: 'out' as Tone })) };

    case cmd === 'skills' || cmd === 'ls skills':
      return {
        lines: [
          { text: 'tech stack:', tone: 'accent' },
          ...skillCategories.map(c => ({
            text: `  ${pad(c.key, 11)}${c.skills.map(s => s.name).join(', ')}`,
            tone: 'out' as Tone,
          })),
        ],
      };

    case cmd === 'projects' || cmd === 'ls projects': {
      const lines: OutputLine[] = [{ text: 'featured projects:', tone: 'accent' }];
      for (const p of projects) {
        lines.push({ text: `  • ${L ? p.titleAr : p.title}  [${p.tags.join(', ')}]`, tone: 'out' });
        lines.push({ text: `    ${p.live}`, tone: 'muted', href: p.live });
      }
      lines.push({ text: '↓ opening projects section…', tone: 'ok' });
      return { lines, action: { type: 'scroll', id: 'projects' } };
    }

    case cmd === 'experience': {
      const lines: OutputLine[] = [{ text: 'work experience:', tone: 'accent' }];
      for (const e of experiences) {
        lines.push({ text: `  • ${L ? e.roleAr : e.role} @ ${L ? e.companyAr : e.company}`, tone: 'out' });
        lines.push({ text: `    ${L ? e.periodAr : e.period}`, tone: 'muted' });
      }
      return { lines };
    }

    case cmd === 'contact':
      return {
        lines: [
          { text: "let's talk:", tone: 'accent' },
          { text: `  ${pad('email', 11)}${CONTACT.email}`, tone: 'out', href: `mailto:${CONTACT.email}` },
          { text: `  ${pad('whatsapp', 11)}${CONTACT.whatsapp}`, tone: 'out', href: CONTACT.whatsapp },
          { text: `  ${pad('linkedin', 11)}${CONTACT.linkedin}`, tone: 'out', href: CONTACT.linkedin },
          { text: `  ${pad('github', 11)}${CONTACT.github}`, tone: 'out', href: CONTACT.github },
          { text: `  ${pad('location', 11)}${ctx.location}`, tone: 'muted' },
          { text: '↓ scrolling to contact…', tone: 'ok' },
        ],
        action: { type: 'scroll', id: 'contact' },
      };

    // ── action commands (print a confirmation, then do the thing) ───────────
    case cmd === 'email':
      return {
        lines: [
          { text: 'opening mail client…', tone: 'ok' },
          { text: `  ${CONTACT.email}`, tone: 'muted', href: `mailto:${CONTACT.email}` },
        ],
        action: { type: 'open', href: `mailto:${CONTACT.email}` },
      };

    case cmd === 'github':
      return {
        lines: [
          { text: 'opening GitHub ↗', tone: 'ok' },
          { text: `  ${CONTACT.github}`, tone: 'muted', href: CONTACT.github },
        ],
        action: { type: 'open', href: CONTACT.github },
      };

    case cmd === 'linkedin':
      return {
        lines: [
          { text: 'opening LinkedIn ↗', tone: 'ok' },
          { text: `  ${CONTACT.linkedin}`, tone: 'muted', href: CONTACT.linkedin },
        ],
        action: { type: 'open', href: CONTACT.linkedin },
      };

    case cmd === 'resume' || cmd === 'cv':
      return {
        lines: [
          { text: 'opening résumé ↗', tone: 'ok' },
          { text: `  ${RESUME}`, tone: 'muted', href: RESUME },
        ],
        action: { type: 'open', href: RESUME },
      };

    case cmd === 'clear' || cmd === 'cls':
      return { clear: true };

    // ── tasteful easter eggs ───────────────────────────────────────────────
    case cmd === 'ls':
      return { lines: [{ text: 'about  skills  projects  experience  contact', tone: 'out' }] };

    case cmd === 'sudo' || cmd.startsWith('sudo '):
      return { lines: [{ text: 'permission denied: nice try 🙂 (you already own this page — just scroll)', tone: 'err' }] };

    case cmd.startsWith('echo '):
      return { lines: [{ text: input.slice(5), tone: 'out' }] };

    case cmd === 'pwd':
      return { lines: [{ text: '/home/alaa/portfolio', tone: 'out' }] };

    case cmd === 'date':
      return { lines: [{ text: new Date().toString(), tone: 'out' }] };

    case cmd === 'hi' || cmd === 'hello' || cmd === 'hey':
      return { lines: [{ text: `hey! 👋 type 'help' to see what you can do.`, tone: 'out' }] };

    case cmd === 'joke':
      return { lines: [{ text: 'there are 10 kinds of people: those who read binary, and those who don’t.', tone: 'out' }] };

    default:
      return {
        lines: [
          { text: `command not found: ${input} — type 'help' for available commands`, tone: 'err' },
        ],
      };
  }
}
