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

/** Commands shown by `help`, grouped by their two consistent behaviours. */
// TYPE A — navigate: print a confirmation line, then smooth-scroll to the section.
const NAV_COMMANDS: [string, string][] = [
  ['about', 'who I am'],
  ['skills', 'tech stack & tools'],
  ['projects', 'selected work'],
  ['experience', 'career history'],
  ['contact', 'inquiries '],
];
// TYPE B — info / action: print (or open a link) in place, no page scroll.
const INFO_COMMANDS: [string, string][] = [
  ['help', 'show this list of commands'],
  ['whoami', 'name & role'],
  ['email', 'open a new email to me ↗'],
  ['github', 'open my GitHub ↗'],
  ['linkedin', 'open my LinkedIn ↗'],
  ['resume', 'open my résumé / CV ↗'],
  ['cls', 'clear the terminal'],
];

const pad = (s: string, n: number) => (s.length >= n ? s + ' ' : s + ' '.repeat(n - s.length));

export function runCommand(raw: string, ctx: TermContext): CommandResult {
  const input = raw.trim().replace(/\s+/g, ' ');
  const cmd = input.toLowerCase();

  // Empty line: just a fresh prompt, no output.
  if (cmd === '') return { lines: [] };

  switch (true) {
    case cmd === 'help':
      return {
        lines: [
          { text: 'available commands:', tone: 'accent' },
          { text: 'NAVIGATION:', tone: 'muted' },
          ...NAV_COMMANDS.map(([n, d]) => ({ text: `  ${pad(n, 11)}${d}`, tone: 'out' as Tone })),
          { text: 'PERSONAL INFO:', tone: 'muted' },
          ...INFO_COMMANDS.map(([n, d]) => ({ text: `  ${pad(n, 11)}${d}`, tone: 'out' as Tone })),
          { text: 'tip: section commands scroll the page; the rest print right here.', tone: 'muted' },
        ],
      };

    case cmd === 'whoami':
      return {
        lines: [
          { text: ctx.name, tone: 'name' },
          { text: ctx.role, tone: 'out' },
          // { text: ctx.status, tone: 'ok' },
        ],
      };

    // ── TYPE A: navigate — print a confirmation line, then smooth-scroll ─────
    case cmd === 'about':
      return { lines: [{ text: '→ opening about…', tone: 'ok' }], action: { type: 'scroll', id: 'about' } };

    case cmd === 'skills' || cmd === 'ls skills':
      return { lines: [{ text: '→ opening skills…', tone: 'ok' }], action: { type: 'scroll', id: 'skills' } };

    case cmd === 'projects' || cmd === 'ls projects':
      return { lines: [{ text: '→ opening projects…', tone: 'ok' }], action: { type: 'scroll', id: 'projects' } };

    case cmd === 'experience':
      return { lines: [{ text: '→ opening experience…', tone: 'ok' }], action: { type: 'scroll', id: 'experience' } };

    case cmd === 'contact':
      return { lines: [{ text: '→ opening contact…', tone: 'ok' }], action: { type: 'scroll', id: 'contact' } };

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
      return { lines: [{ text: 'permission denied: you can\'t sudo your way through this one — try scrolling.', tone: 'err' }] };

    case cmd.startsWith('echo '):
      return { lines: [{ text: input.slice(5), tone: 'out' }] };

    // case cmd === 'pwd':
    //   return { lines: [{ text: '/home/alaa/portfolio', tone: 'out' }] };

    case cmd === 'date':
      return { lines: [{ text: new Date().toString(), tone: 'out' }] };

    case cmd === 'hi' || cmd === 'hello' || cmd === 'hey':
      return { lines: [{ text: `hi. this terminal listens. type 'help' for commands.`, tone: 'out' }] };

    case cmd === 'joke':
      const jokes = [
  'You know what screams "I\'m insecure"? http://',
  'Why do web developers wear glasses? To improve their site.',
  'I got really angry and smashed my keyboard. I completely lost CTRL.',
  'There are only 10 kinds of people in the world: those who understand binary and those who don’t.',
  'My code has commitment issues. It refuses to commit.',
  'There’s no place like 127.0.0.1.',
  // 'My code and I have something in common. We both break under pressure.',
  // 'My website has trust issues. It refuses insecure connections.',
  // 'I named my dog "Cache". Now he only comes back when he feels like it.',
  'I asked CSS to center something. It laughed.',
  'JavaScript developers don’t make mistakes. They make unexpected features.',
  '404. Joke not found.',
  // 'I told my code to behave. It threw an exception.',
  // 'My password is "incorrect". Now whenever I forget it, the computer reminds me.',
  // 'I’m emotionally attached to my bugs. I raised them myself.',
  'My code works perfectly. Until someone else runs it.',
  'I started using tabs. Now everyone needs therapy.',
  // 'There’s no cloud. It’s just someone else’s computer.',
  // 'I would tell you a UDP joke... but you might not get it.',
  'To understand recursion, you must first understand recursion.',
  // 'I only trust atoms and immutable objects.',
  'I refactored my code. The bugs appreciated the new layout.',
  'My code is like a horror movie. Don’t look behind the comments.',
  // 'I don’t always test my code. My users do.',
  // 'Home is where the Wi-Fi connects automatically.',
  'I tried to fix one bug. Now it’s a feature.',
  'My favorite exercise is running npm install.',
  // 'The bug wasn’t in my code. It was in production’s opinion.',
  // 'I love deadlines. They make my CPU spike.',
  'My code is clean. The stack trace is just decorative.',
  // 'I use AI to write code. It uses me to find bugs.',
  // 'The only thing recursive about me is my imposter syndrome.',
  'I told my computer I needed a break. It froze.',
  // 'I finally found the bug. It was between the keyboard and the chair.',
  // 'Programmers never die. They just lose their memory.',
  'My code has excellent security. Even I can’t get in.',
  'If it works, don’t touch it. If you touched it, good luck.',
  // 'I opened Stack Overflow for one answer. Three hours later I knew medieval history.',
  'The best debugger is still console.log.',
  // 'I removed a semicolon. The entire application entered the quantum realm.',
  // 'Every time I optimize my code, I discover a new bottleneck.',
  'There’s nothing more permanent than a temporary fix.',
  'My favorite design pattern is Copy & Paste.',
  'I wanted to write elegant code. Then the deadline happened.',
  'The code compiled. Nobody knows why.',
  'I use dark mode. It hides the bugs.',
  'My API has one endpoint: disappointment.',
  'The backend is fine. The frontend disagrees.',
  // 'I wrote self-documenting code. Unfortunately, it only speaks to me.',
  // 'Everything is wireless until you need to debug it.'
];
      return {
    lines: [
      {
        text: jokes[Math.floor(Math.random() * jokes.length)],
        tone: 'out'
      }
    ]
  };

    default:
      return {
        lines: [
          { text: `command not found: ${input} — type 'help' for available commands`, tone: 'err' },
        ],
      };
  }
}
