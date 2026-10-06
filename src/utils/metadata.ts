import type { PageMetadata } from '../types';

export function extractPageTitle(): string {
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
  if (ogTitle) return ogTitle;

  const h1Title = document.querySelector('h1')?.textContent?.trim();
  if (h1Title && h1Title.length > 5) return h1Title;

  if (document.title && document.title.length > 0) return document.title;

  return window.location.hostname;
}

export function extractMetadata(): PageMetadata {
  const metadata: PageMetadata = {};

  // Author
  const author = document.querySelector('meta[name="author"]')?.getAttribute('content') ||
                 document.querySelector('meta[property="article:author"]')?.getAttribute('content');
  if (author) metadata.author = author;

  // Publish Date
  const publishDate = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
                      document.querySelector('time[datetime]')?.getAttribute('datetime') ||
                      document.querySelector('meta[property="datePublished"]')?.getAttribute('content');
  if (publishDate) metadata.publish_date = publishDate;

  // Description
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                      document.querySelector('meta[property="og:description"]')?.getAttribute('content');
  if (description) metadata.description = description;

  // Favicon
  const favicon = document.querySelector('link[rel="icon"]')?.getAttribute('href') ||
                  document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href');
  
  if (favicon) {
    try {
      metadata.favicon = new URL(favicon, window.location.href).href;
    } catch {
      metadata.favicon = favicon;
    }
  } else {
    metadata.favicon = `${window.location.origin}/favicon.ico`;
  }

  // Language
  const lang = document.documentElement.lang;
  if (lang) metadata.language = lang;

  // Reading Time
  const textContent = document.body.textContent || '';
  const wordCount = textContent.trim().split(/\s+/).length;
  metadata.reading_time = Math.max(1, Math.ceil(wordCount / 250));

  // Tags
  const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
  if (keywords) {
    metadata.tags = keywords.split(',').map(t => t.trim()).filter(Boolean);
  } else {
    const articleTags = Array.from(document.querySelectorAll('meta[property="article:tag"]'))
      .map(el => el.getAttribute('content'))
      .filter(Boolean) as string[];
    if (articleTags.length > 0) metadata.tags = articleTags;
  }

  return metadata;
}
