/**
 * Gets the full URL for an image asset.
 * If NEXT_PUBLIC_R2_URL is set in .env.local, it will serve images from the Cloudflare R2 bucket.
 * Otherwise, it will fallback to the local Next.js public directory (http://localhost:3000).
 * 
 * @param path The relative path from the database (e.g., "/images/champions/Aatrox.png")
 * @returns The absolute URL to the image
 */
export const getImageUrl = (path: string | undefined): string => {
  // If path is empty, return the default Poro avatar
  if (!path) return "/img/default-avatar.png"; 

  // Intercept dead GitHub Poro URL and use the local Poro image instead
  if (path === 'https://raw.githubusercontent.com/DotA2-Fans/Icons/main/summoners_rift/icons/poro.png') {
    return '/img/default-avatar.png';
  }

  // If path is already an absolute URL (e.g. from external seed), return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Use R2 Bucket URL if configured, otherwise fallback to local dev server
  const baseUrl = process.env.NEXT_PUBLIC_R2_URL || "http://localhost:3000";

  // Ensure exactly one slash between baseUrl and path
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};
