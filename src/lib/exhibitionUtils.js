export function getImages(item) {
  if (!item) return [];
  if (item.images) {
    try {
      const parsed = JSON.parse(item.images);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fall through
    }
  }
  return item.image_url ? [item.image_url] : [];
}