// Minimal, dependency-free TipTap-JSON → HTML renderer.
//
// LMS course descriptions are stored as TipTap document JSON (the LMS admin
// uses a TipTap rich-text editor). The website has no TipTap dependency, so
// this walks the document and emits a small whitelist of safe HTML tags.
// Everything is escaped; only known node/mark types produce markup; link
// hrefs are restricted to http(s)/mailto. Anything that isn't valid TipTap
// JSON (e.g. a legacy plain-text description) falls back to escaped text with
// preserved line breaks.

type TipTapMark = { type: string; attrs?: Record<string, unknown> };
type TipTapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: TipTapMark[];
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeHref(href: unknown): string | null {
  if (typeof href !== 'string') return null;
  const v = href.trim();
  if (/^(https?:|mailto:)/i.test(v)) return escapeHtml(v);
  return null;
}

function renderText(node: TipTapNode): string {
  let html = escapeHtml(node.text ?? '');
  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case 'bold':
        html = `<strong>${html}</strong>`;
        break;
      case 'italic':
        html = `<em>${html}</em>`;
        break;
      case 'underline':
        html = `<u>${html}</u>`;
        break;
      case 'strike':
        html = `<s>${html}</s>`;
        break;
      case 'code':
        html = `<code>${html}</code>`;
        break;
      case 'link': {
        const href = safeHref(mark.attrs?.href);
        html = href
          ? `<a href="${href}" target="_blank" rel="noopener noreferrer nofollow">${html}</a>`
          : html;
        break;
      }
      default:
        break;
    }
  }
  return html;
}

function renderNode(node: TipTapNode): string {
  const children = () => (node.content ?? []).map(renderNode).join('');
  switch (node.type) {
    case 'doc':
      return children();
    case 'text':
      return renderText(node);
    case 'paragraph':
      return `<p>${children()}</p>`;
    case 'heading': {
      const level = Math.min(Math.max(Number(node.attrs?.level) || 2, 1), 6);
      return `<h${level}>${children()}</h${level}>`;
    }
    case 'bulletList':
      return `<ul>${children()}</ul>`;
    case 'orderedList':
      return `<ol>${children()}</ol>`;
    case 'listItem':
      return `<li>${children()}</li>`;
    case 'blockquote':
      return `<blockquote>${children()}</blockquote>`;
    case 'codeBlock':
      return `<pre><code>${children()}</code></pre>`;
    case 'hardBreak':
      return '<br />';
    case 'horizontalRule':
      return '<hr />';
    default:
      // Unknown block node: render its children so no text is ever lost.
      return children();
  }
}

// Returns safe HTML for a stored course description, or null if empty.
export function courseDescriptionToHtml(description: string | null | undefined): string | null {
  if (!description) return null;
  const trimmed = description.trim();
  if (!trimmed) return null;

  // TipTap docs are objects; a plain-text legacy description is not JSON.
  if (trimmed.startsWith('{')) {
    try {
      const doc = JSON.parse(trimmed) as TipTapNode;
      if (doc && doc.type === 'doc') {
        const html = renderNode(doc).trim();
        return html || null;
      }
    } catch {
      // fall through to plain-text handling
    }
  }

  // Legacy / plain-text description: escape and preserve line breaks.
  return `<p>${escapeHtml(trimmed).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br />')}</p>`;
}
