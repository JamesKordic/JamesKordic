/** Use verified page-sized previews while retaining original sources for fullscreen media. */
export function getMediaPreviewSrc(src: string): string {
  return src.replace(/^\/projects\/voltage\/citrus-distortion-4k\/([^/]+)\.png$/, '/projects/voltage/citrus-distortion/$1.jpg');
}
