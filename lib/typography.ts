/** Joins the last two words of every paragraph with a non-breaking space
 *  so a single word is never stranded on its own line (a typographic
 *  orphan). Handles multi-paragraph strings: source text separates
 *  paragraphs with \n, which `whitespace-pre-line` preserves, so the
 *  last word of every line gets bound to the word before it. */
export function deWidow(text: string): string {
  return text.replace(/[ \t]+(\S+)(?=\n|$)/g, '\u00A0$1');
}
