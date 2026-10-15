export function CopyIcon({ copied = false }: { copied?: boolean }) {
  return <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">{copied ? <path d="m1.5 5 2.25 2.25L8.5 2.5" stroke="currentColor" /> : <><rect x="4" y="4" width="4" height="4" stroke="currentColor" /><path d="M6 2H2v4" stroke="currentColor" /></>}</svg>;
}
