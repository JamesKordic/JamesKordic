import { GUTTER_X, RULE_PY, SECTION_T } from '@/lib/spacing';

/** Every page closes with one line. */
export function PageFooter() {
  return (
    <footer className={`${SECTION_T} w-full ${GUTTER_X}`}>
      <p className={`border-t border-line ${RULE_PY} text-[15px] text-muted`}>
        © {new Date().getFullYear()} James Kordic
      </p>
    </footer>
  );
}
