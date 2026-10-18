/** Keep search and sharing descriptions within their budget without splitting words. */
export function getMetadataDescription(description: string, maxLength = 160): string {
  const text = description.trim();
  if (text.length <= maxLength) return text;

  const excerpt = text.slice(0, maxLength - 1);
  const lastSpace = excerpt.lastIndexOf(' ');
  return `${excerpt.slice(0, lastSpace > 0 ? lastSpace : excerpt.length).trimEnd()}…`;
}
