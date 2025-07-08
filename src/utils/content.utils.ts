// check if a content type is text-based
export function isTextBasedContentType(contentType: string): boolean {
  if (!contentType) return false;
  
  return contentType.startsWith('text/') || 
         contentType.includes('json') || 
         contentType.includes('xml') || 
         contentType.includes('javascript');
}
