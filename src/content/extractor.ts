import { NOISE_SELECTORS, CONTENT_SELECTORS, MAX_CONTENT_LENGTH } from '../utils/constants';

export function extractPageContent(): string {
  // 1. Clone body to avoid messing up the actual page
  const clone = document.body.cloneNode(true) as HTMLElement;

  // 2. Remove noise
  const elementsToRemove = clone.querySelectorAll(NOISE_SELECTORS.join(','));
  elementsToRemove.forEach(el => el.remove());

  // 3. Find main content container
  let contentContainer = clone;
  for (const selector of CONTENT_SELECTORS) {
    const container = clone.querySelector(selector) as HTMLElement;
    if (container) {
      contentContainer = container;
      break;
    }
  }

  // 4. Convert DOM to Markdown
  let markdown = convertToMarkdown(contentContainer);

  // 5. Post-process
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
  
  if (markdown.length > MAX_CONTENT_LENGTH) {
    markdown = markdown.substring(0, MAX_CONTENT_LENGTH) + '\n\n...[Content truncated due to length limits]';
  }

  return markdown;
}

function convertToMarkdown(node: Node, indent = ''): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    // Preserve formatting in pre/code blocks, trim otherwise
    return node.parentElement && ['PRE', 'CODE'].includes(node.parentElement.tagName) 
      ? text 
      : text.replace(/\s+/g, ' ');
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const el = node as HTMLElement;
  const tag = el.tagName.toUpperCase();

  // Handle hidden elements
  if (el.style.display === 'none' || el.style.visibility === 'hidden') return '';

  let markdown = '';
  
  switch (tag) {
    case 'H1': markdown = `\n\n# ${el.textContent?.trim()}\n\n`; break;
    case 'H2': markdown = `\n\n## ${el.textContent?.trim()}\n\n`; break;
    case 'H3': markdown = `\n\n### ${el.textContent?.trim()}\n\n`; break;
    case 'H4': markdown = `\n\n#### ${el.textContent?.trim()}\n\n`; break;
    case 'H5': markdown = `\n\n##### ${el.textContent?.trim()}\n\n`; break;
    case 'H6': markdown = `\n\n###### ${el.textContent?.trim()}\n\n`; break;
    
    case 'P':
      markdown = '\n\n' + Array.from(el.childNodes).map(n => convertToMarkdown(n)).join('').trim() + '\n\n';
      break;
      
    case 'A':
      try {
        const href = new URL((el as HTMLAnchorElement).href, window.location.href).href;
        const text = Array.from(el.childNodes).map(n => convertToMarkdown(n)).join('').trim();
        markdown = text ? `[${text}](${href})` : '';
      } catch {
        markdown = Array.from(el.childNodes).map(n => convertToMarkdown(n)).join('').trim();
      }
      break;
      
    case 'STRONG':
    case 'B':
      markdown = `**${Array.from(el.childNodes).map(n => convertToMarkdown(n)).join('').trim()}**`;
      break;
      
    case 'EM':
    case 'I':
      markdown = `*${Array.from(el.childNodes).map(n => convertToMarkdown(n)).join('').trim()}*`;
      break;
      
    case 'CODE':
      if (el.parentElement?.tagName !== 'PRE') {
        markdown = `\`${el.textContent?.trim()}\``;
      } else {
        markdown = el.textContent || '';
      }
      break;
      
    case 'PRE':
      const codeClass = el.querySelector('code')?.className || el.className;
      const langMatch = codeClass.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : '';
      markdown = `\n\n\`\`\`${lang}\n${el.textContent?.trim()}\n\`\`\`\n\n`;
      break;
      
    case 'UL':
    case 'OL':
      markdown = '\n';
      let index = 1;
      Array.from(el.children).forEach(li => {
        if (li.tagName === 'LI') {
          const prefix = tag === 'UL' ? '-' : `${index}.`;
          markdown += `${indent}${prefix} ${Array.from(li.childNodes).map(n => convertToMarkdown(n, indent + '  ')).join('').trim()}\n`;
          index++;
        }
      });
      markdown += '\n';
      break;
      
    case 'TABLE':
      markdown = '\n\n';
      const rows = el.querySelectorAll('tr');
      rows.forEach((row, i) => {
        const cols = Array.from(row.querySelectorAll('td, th'));
        markdown += '| ' + cols.map(c => c.textContent?.trim().replace(/\|/g, '\\|') || '').join(' | ') + ' |\n';
        if (i === 0) {
          markdown += '| ' + cols.map(() => '---').join(' | ') + ' |\n';
        }
      });
      markdown += '\n\n';
      break;
      
    case 'BLOCKQUOTE':
      markdown = `\n\n> ${Array.from(el.childNodes).map(n => convertToMarkdown(n)).join('').trim()}\n\n`;
      break;
      
    case 'IMG':
      const img = el as HTMLImageElement;
      if (img.src) {
        try {
          const src = new URL(img.src, window.location.href).href;
          const alt = img.alt || '';
          markdown = `![${alt}](${src})`;
        } catch { /* ignore */ }
      }
      break;
      
    case 'BR':
      markdown = '\n';
      break;
      
    case 'HR':
      markdown = '\n\n---\n\n';
      break;
      
    default:
      markdown = Array.from(el.childNodes).map(n => convertToMarkdown(n, indent)).join('');
  }

  return markdown;
}
