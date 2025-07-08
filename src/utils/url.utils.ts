// sanitize url, remove slashes at the end
export function sanitizeUrl(url: string): string {
  if (!url) return url;
  return url.replace(/\/+$/, '');
}

// validate url
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
