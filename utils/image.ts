// Artwork is the product, but grids must never download full-resolution files.
// Cloudinary can resize on the fly by inserting a transformation into the URL.
export function sizedImage(url: string, width: number): string {
  const marker = "/upload/";
  if (!url.includes("res.cloudinary.com") || !url.includes(marker)) return url;
  if (/\/upload\/[^/]*w_\d+/.test(url)) return url; // already transformed
  return url.replace(marker, `${marker}c_limit,w_${Math.round(width)},q_auto,f_auto/`);
}
