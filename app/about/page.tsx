export default function AboutPage() {
  return (
    <div className="px-4 lg:px-8 pt-20 lg:pt-24 pb-12 max-w-7xl">
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-4">
        ◉ INCOMING SIGNAL · ABOUT
      </div>

      <h1 className="font-display font-light text-[60px] lg:text-[140px] tracking-[-0.035em] leading-[0.88] mb-12">
        Hello, <span className="display-italic text-coral">it&apos;s</span>
        <br />
        James <span className="display-italic text-coral">Kordic</span>
      </h1>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mb-16">
        <div className="lg:col-span-7 space-y-5">
          <p className="text-[18px] lg:text-[22px] leading-[1.55] text-ink-2 font-display font-light">
            A graphic and motion designer based in New York, creating digital ads, social
            content, and motion graphics for brands and the agencies that work with them. Advertising
            experience and a mixed-media approach drive results-focused creative work.
          </p>
          <p className="text-[16px] leading-[1.65] text-ink-3">
            Work for Taco Bell, FX, MNRK Heavy, Consensus by CoinDesk, and The Syndicate, along with
            large-scale campaigns for the Rochester Institute of Technology — where I earned a BFA in
            Graphic Design. Away from the screen, usually deep in music or experimenting with film
            photography.
          </p>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <Stat n="09" l="Released projects" />
          <Stat n="04" l="Years designing professionally" />
          <Stat n="BFA" l="Graphic Design, RIT" />
          <Stat n="NYC" l="Currently broadcasting from" />
        </div>
      </div>

      {/* Contact */}
      <div className="border-t border-ink/15 pt-12">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-6">
          ✉ MAKE CONTACT
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/15">
          <ContactRow
            label="Email"
            value="Jkordic@me.com"
            href="mailto:Jkordic@me.com"
          />
          <ContactRow
            label="Phone"
            value="+1 (631) 742-8043"
            href="tel:+16317428043"
          />
          <ContactRow
            label="LinkedIn"
            value="linkedin.com/in/jameskordic"
            href="https://www.linkedin.com/in/jameskordic/"
            external
          />
          <ContactRow
            label="Instagram"
            value="@jameskordic"
            href="https://www.instagram.com/jameskordic/"
            external
          />
          <ContactRow
            label="Résumé"
            value="View / Download PDF"
            href="https://drive.google.com/file/d/10fG8m5VriZOOSDyXZnowGsIqEZaRUp6Y/view"
            external
          />
        </div>
      </div>

      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mt-16 flex items-center justify-between">
        <span>© 2026 JAMES KORDIC</span>
        <span>END OF TRANSMISSION ✕</span>
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-ink/15 pb-3">
      <span className="font-display font-light text-[40px] lg:text-[56px] tracking-[-0.02em] leading-none text-coral tabular-nums">
        {n}
      </span>
      <span className="text-[14px] lg:text-[15px] text-ink-3 flex-1">{l}</span>
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="bg-paper hover:bg-paper-2 transition-colors p-6 flex items-center justify-between group"
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
          {label}
        </span>
        <span className="font-display font-medium text-[17px] lg:text-[20px] group-hover:text-coral transition-colors">
          {value}
        </span>
      </div>
      <span className="font-mono text-[14px] text-muted group-hover:text-coral group-hover:translate-x-1 transition-all">
        →
      </span>
    </a>
  );
}
