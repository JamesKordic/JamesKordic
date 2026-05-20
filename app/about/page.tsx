export default function AboutPage() {
  return (
    <div className="px-5 lg:px-8 pt-[80px] pb-10 max-w-[900px]">
      <div className="text-[12px] font-bold tracking-[0.05em] uppercase text-accent">
        About / Contact
      </div>
      <h1 className="font-display font-extrabold leading-[1.02] tracking-[-0.03em] my-3 mb-[26px] text-[34px] lg:text-[58px]">
        Designing brands that connect across digital platforms.
      </h1>
      <p className="text-[16px] leading-[1.7] text-[#d4d2cc] mb-[18px] max-w-[680px]">
        James Kordic is a Graphic and Motion Designer based in New York, creating digital ads,
        social content, and motion graphics for brands and agencies. His advertising experience and
        mixed-media approach drive results-focused creative work.
      </p>
      <p className="text-[16px] leading-[1.7] text-[#d4d2cc] mb-[18px] max-w-[680px]">
        He has produced work for Taco Bell, FX, and The Syndicate, along with large-scale campaigns
        for the Rochester Institute of Technology — where he earned a BFA in Graphic Design. Away
        from the screen, he&apos;s usually deep in music or experimenting with film photography.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] my-7 mb-8">
        {[
          { n: '9', l: 'Released projects' },
          { n: '4 yrs', l: 'Designing professionally' },
          { n: 'BFA', l: 'Graphic Design, RIT' },
          { n: 'NYC', l: 'Based in New York' },
        ].map((s) => (
          <div key={s.l} className="bg-panel rounded-[9px] p-[18px]">
            <div className="font-display font-extrabold text-[32px] tracking-[-0.02em] text-accent">
              {s.n}
            </div>
            <div className="text-[13px] text-muted mt-[5px]">{s.l}</div>
          </div>
        ))}
      </div>

      <h3 className="font-display font-extrabold text-[20px] mt-[30px] mb-[14px]">Get in touch</h3>
      <div className="flex flex-wrap gap-[10px]">
        <ContactChip href="mailto:Jkordic@me.com" label="Jkordic@me.com">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[17px] h-[17px]"
          >
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="m3.5 7 8.5 6 8.5-6" strokeLinecap="round" />
          </svg>
        </ContactChip>
        <ContactChip href="tel:+16317428043" label="+1 (631) 742-8043">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
            <path d="M6.6 3.5 9 3l1.6 4-2 1.5a12 12 0 0 0 5.4 5.4l1.5-2 4 1.6-.5 2.4A2 2 0 0 1 22 21a18 18 0 0 1-19-19 2 2 0 0 1 3.6-1.5Z" />
          </svg>
        </ContactChip>
        <ContactChip
          href="https://www.linkedin.com/in/jameskordic/"
          label="LinkedIn"
          external
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
            <path d="M4.5 3.5A2 2 0 1 1 4.5 7a2 2 0 0 1 0-3.5ZM3 9h3v12H3zm6 0h3v1.7c.6-1 1.9-2 3.8-2 3 0 4.2 2 4.2 5.2V21h-3v-6.4c0-1.6-.6-2.6-2-2.6s-2.3 1-2.3 2.6V21H9z" />
          </svg>
        </ContactChip>
        <ContactChip
          href="https://www.instagram.com/jameskordic/"
          label="Instagram"
          external
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[17px] h-[17px]"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
          </svg>
        </ContactChip>
        <ContactChip
          href="https://drive.google.com/file/d/10fG8m5VriZOOSDyXZnowGsIqEZaRUp6Y/view"
          label="Download résumé"
          external
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[17px] h-[17px]"
          >
            <path
              d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ContactChip>
      </div>

      <p className="text-muted-2 text-[12px] mt-10">
        ©2026 James Kordic · Design Records
      </p>
    </div>
  );
}

function ContactChip({
  href,
  label,
  external = false,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-[9px] bg-elev hover:bg-elev-hi rounded-[30px] px-[18px] py-[11px] font-semibold text-[14px] transition-all hover:-translate-y-0.5"
    >
      {children}
      {label}
    </a>
  );
}
