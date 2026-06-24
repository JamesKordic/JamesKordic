import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROJECTS, getProject, ARTIST } from '@/lib/projects';
import { CaseSection } from '@/components/case-section';

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${ARTIST}`,
    description: p.desc.slice(0, 160),
  };
}

/**
 * Project / case-study page, built on the reference's `project-tidewater.html`
 * scaffold: back link → title block + facts → full-bleed hero → overview
 * (two-col) → approach (full-bleed) → process steps → the work (applications)
 * → recap (full-bleed metrics) → next project. The project's real media is
 * rendered inside the `.app` blocks by the existing media engine.
 */
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) notFound();

  const idx = PROJECTS.findIndex((x) => x.id === p.id);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  const kindLabel = p.kind === 'personal' ? 'Personal' : 'Client work';
  const eyebrow = [kindLabel, ...p.tags].join(' · ');
  const clientValue = p.client || (p.kind === 'personal' ? 'Personal project' : '—');

  // Overview copy — prefer the authored brief, fall back to the description.
  const overviewKicker = p.brief?.eyebrow || 'Overview';
  const overviewHeadline = p.brief?.lead || p.blurb;
  const overviewBody = p.brief?.body?.length ? p.brief.body : [p.desc];

  return (
    <article>
      {/* Back + title block */}
      <div className="wrap">
        <Link className="back" href="/">
          Back to work
        </Link>
        <div className="head">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{p.title}</h1>
          <p className="lede">{p.blurb}</p>
          <dl className="facts">
            <div>
              <dt>Client</dt>
              <dd>{clientValue}</dd>
            </div>
            {p.role && (
              <div>
                <dt>Role</dt>
                <dd>{p.role}</dd>
              </div>
            )}
            <div>
              <dt>Disciplines</dt>
              <dd>{p.tags.join(' · ')}</dd>
            </div>
            {p.year && (
              <div>
                <dt>Year</dt>
                <dd>{p.year}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Hero */}
      <figure className="hero">
        {p.coverVideo ? (
          <video src={p.coverVideo} poster={p.cover} autoPlay muted loop playsInline preload="metadata" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover} alt={`${p.title} cover`} />
        )}
      </figure>

      {/* Overview */}
      <div className="wrap">
        <section className="s">
          <div className="two">
            <div>
              <p className="kicker">{overviewKicker}</p>
              <h2>{overviewHeadline}</h2>
            </div>
            <div className="body">
              {overviewBody.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Approach — full-bleed colour break */}
      {p.approach && (
        <section className="bleed">
          <div className="wrap">
            <p className="kicker">{p.approach.eyebrow || 'The Approach'}</p>
            <h2 style={{ maxWidth: '34ch' }}>{p.approach.intro}</h2>
          </div>
        </section>
      )}

      {/* Process steps */}
      {p.approach?.steps?.length ? (
        <div className="wrap">
          <section className="s">
            <p className="kicker">Process</p>
            <h2>How it came together, step by step.</h2>
            <div className="process">
              {p.approach.steps.map((step, i) => (
                <div className="step" key={i}>
                  <div className="frame">
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="cap">
                    <b>{step.title}</b>
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {/* The work — applications */}
      <div className="wrap">
        <section className="s">
          <p className="kicker">The Work</p>
          <h2>A closer look at the pieces.</h2>

          {p.sections.map((sec, i) => {
            const paragraphs = [sec.context, sec.role, sec.body].filter(Boolean) as string[];
            const titled = !!(sec.title || sec.eyebrow);
            return (
              <div className="app" key={i}>
                {titled && (
                  <p className="tag">
                    {String(i + 1).padStart(2, '0')}
                    {sec.eyebrow ? ` — ${sec.eyebrow}` : ''}
                  </p>
                )}
                {sec.title && <h3>{sec.title}</h3>}
                {paragraphs.map((text, j) => (
                  <p key={j}>{text}</p>
                ))}
                <CaseSection section={sec} headerless />
              </div>
            );
          })}
        </section>
      </div>

      {/* Recap — full-bleed metrics */}
      {p.recap && (
        <section className="bleed">
          <div className="wrap">
            <p className="kicker">{p.recap.eyebrow || 'The Recap'}</p>
            <h2 style={{ maxWidth: '28ch' }}>{p.recap.headline}</h2>
            <div className="metrics">
              {p.recap.stats.map((stat, i) => (
                <div className="metric" key={i}>
                  <div className="big">{stat.value}</div>
                  <div className="lbl">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next project */}
      <div className="wrap">
        <div className="next">
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>Next project</span>
          <Link className="cta" href={`/work/${next.id}`}>
            {next.title} →
          </Link>
        </div>
      </div>
    </article>
  );
}
