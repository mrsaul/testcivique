import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  /** CSS selector of the container whose headings should be indexed. */
  containerSelector?: string;
  title?: string;
  className?: string;
}

/**
 * Auto-generated Table of Contents.
 * Scans the container for <h2 id> and <h3 id> headings and renders an
 * anchor list. Improves Google sitelinks and on-page navigation.
 */
export function TableOfContents({
  containerSelector = 'main',
  title = 'Sommaire',
  className,
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const nodes = container.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]');
    const next: TocItem[] = Array.from(nodes).map((n) => ({
      id: n.id,
      text: n.textContent?.trim() || '',
      level: n.tagName === 'H2' ? 2 : 3,
    }));
    setItems(next);
  }, [containerSelector]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label={title}
      className={`rounded-2xl border bg-card/50 p-5 shadow-sm ${className ?? ''}`}
    >
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
        <List className="w-4 h-4 text-primary" />
        {title}
      </div>
      <ol className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${item.id}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
