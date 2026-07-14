import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Modal from './Modal';

// Fixed on purpose — NOT new Date(). This is the date the wording below last
// changed materially. Bump it only when the policy text itself changes, never
// on a redeploy.
const LAST_UPDATED = '2026-07-14';

type Section = { h: string; p: string[]; list: string[] };
type Doc = { title: string; intro: string; sections: Section[] };

function formatUpdated(locale: string) {
  // Fixed input, so this is deterministic across server and client. 'ar-EG'
  // renders Arabic-Indic numerals (١٤ يوليو ٢٠٢٦).
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(`${LAST_UPDATED}T00:00:00Z`));
}

function DocBody({ doc, updatedLabel, updated }: { doc: Doc; updatedLabel: string; updated: string }) {
  return (
    <>
      <p className="legal-updated">{updatedLabel}: {updated}</p>
      <p className="legal-intro">{doc.intro}</p>

      {doc.sections.map((s, i) => (
        <section key={i} className="legal-section">
          <h3 className="legal-h">{s.h}</h3>
          {s.p.map((para, j) => <p key={j} className="legal-p">{para}</p>)}
          {s.list.length > 0 && (
            <ul className="legal-ul">
              {s.list.map((li, j) => <li key={j}>{li}</li>)}
            </ul>
          )}
        </section>
      ))}
    </>
  );
}

export default function Legal() {
  const { t, locale, isRTL } = useTranslation();
  const [open, setOpen] = useState<null | 'privacy' | 'terms'>(null);
  const updated = formatUpdated(locale);
  const legal = t.legal;

  return (
    <>
      <nav className="legal-links" aria-label={legal.navLabel}>
        <button type="button" className="legal-link" onClick={() => setOpen('privacy')}>
          {legal.privacy.title}
        </button>
        <span className="legal-sep" aria-hidden="true">·</span>
        <button type="button" className="legal-link" onClick={() => setOpen('terms')}>
          {legal.terms.title}
        </button>
      </nav>

      <Modal
        open={open === 'privacy'}
        onClose={() => setOpen(null)}
        title={legal.privacy.title}
        titleId="privacy-title"
        isRTL={isRTL}
        closeLabel={legal.close}
      >
        <DocBody doc={legal.privacy} updatedLabel={legal.updated} updated={updated} />
      </Modal>

      <Modal
        open={open === 'terms'}
        onClose={() => setOpen(null)}
        title={legal.terms.title}
        titleId="terms-title"
        isRTL={isRTL}
        closeLabel={legal.close}
      >
        <DocBody doc={legal.terms} updatedLabel={legal.updated} updated={updated} />
      </Modal>
    </>
  );
}
