import { PROJECTS } from '@/lib/projects';
import { WorkCard } from '@/components/work-card';
import { SITE_TEXT } from '@/lib/site-text';

const T = SITE_TEXT;

export default function HomePage() {
  return (
    <div>
      {/* Intro */}
      <section className="max-w-[640px] pb-12 border-b border-line">
        <div className="text-[12px] uppercase tracking-[2px] text-accent font-bold mb-5">
          Portfolio — 2026
        </div>
        <h1 className="font-display font-normal text-[clamp(34px,4.5vw,58px)] leading-[1.1] tracking-[-0.5px]">
          Graphic &amp; motion design for brands that need to{' '}
          <em className="italic text-accent">move and make noise</em>.
        </h1>
        <p className="text-[17px] text-text/85 mt-6">{T.home.cta.subhead}</p>
      </section>

      {/* Selected work */}
      <div className="flex items-baseline justify-between mt-12 mb-6">
        <h2 className="text-[13px] uppercase tracking-[2px] text-muted">Selected Work</h2>
        <span className="text-[13px] text-muted">2023 — 2025</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-9">
        {PROJECTS.map((p, i) => (
          <WorkCard key={p.id} p={p} i={i} feature={i === 0} />
        ))}
      </div>

      {/* Call to action */}
      <section className="mt-16 pt-11 border-t border-line">
        <h2 className="font-display font-normal text-[clamp(28px,4vw,48px)] leading-[1.1]">
          Have a project in mind?
          <br />
          <a
            href={`mailto:${T.contact.email}`}
            className="group italic text-accent border-b-2 border-accent transition-colors duration-200 hover:text-text hover:border-text"
          >
            Let&rsquo;s talk{' '}
            <span className="inline-block not-italic transition-transform duration-200 group-hover:translate-x-1.5">
              →
            </span>
          </a>
        </h2>
      </section>

      <p className="text-muted-2 text-[12px] mt-14">{T.footer.copyright}</p>
    </div>
  );
}
