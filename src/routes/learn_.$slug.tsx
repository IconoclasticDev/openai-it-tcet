import { createFileRoute } from '@tanstack/react-router'
import React, { useEffect } from 'react'
import { pageLinks, siteMeta } from '../lib/site-head'
import { usePagesScript } from '../lib/use-pages-script'
import { SiteHeader } from '../components/SiteHeader'


import paper1 from '../site/papers/attention-is-all-you-need-reproduction.html?raw'
import paper2 from '../site/papers/lora-low-rank-adaptation-guide.html?raw'
import paper3 from '../site/papers/direct-preference-optimization-dpo.html?raw'
import paper4 from '../site/papers/llama-3-rope-swiglu-architecture.html?raw'
import paper5 from '../site/papers/flashattention-memory-efficient-attention.html?raw'
import paper6 from '../site/papers/deepseek-r1-grpo-reasoning-reproduction.html?raw'

const papersMap: Record<string, string> = {
  'attention-is-all-you-need-reproduction': paper1,
  'lora-low-rank-adaptation-guide': paper2,
  'direct-preference-optimization-dpo': paper3,
  'llama-3-rope-swiglu-architecture': paper4,
  'flashattention-memory-efficient-attention': paper5,
  'deepseek-r1-grpo-reasoning-reproduction': paper6
}

export const Route = createFileRoute('/learn_/$slug')({
  component: PaperComponent,
  head: () => ({
    meta: siteMeta(
      'Technical Write-up | Open AI IT TCET',
      'In-depth paper reproduction and technical write-up from the Open AI IT committee at TCET.',
    ),
    links: pageLinks,
  })
})

function PaperComponent() {
  const { slug } = Route.useParams()
  const html = papersMap[slug]
  usePagesScript(slug)
  
  useEffect(() => {
    if (!html) return;
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      if (btn.textContent?.includes('Copy Code') && !btn.hasAttribute('data-copy-attached')) {
        btn.setAttribute('data-copy-attached', 'true');
        btn.addEventListener('click', () => {
          const pre = btn.closest('div.group')?.querySelector('pre') || btn.parentElement?.parentElement?.querySelector('pre');
          if (pre) {
            let code = '';
            const rows = pre.querySelectorAll('.table-row');
            if (rows.length > 0) {
              rows.forEach(row => {
                const cells = row.querySelectorAll('.table-cell');
                if (cells.length > 1) {
                  code += (cells[1]?.textContent ?? '') + '\n';
                } else if (cells.length === 1) {
                  code += (cells[0]?.textContent ?? '') + '\n';
                }
              });
            } else {
              code = pre.textContent || '';
            }
            
            navigator.clipboard.writeText(code).then(() => {
              const originalHtml = btn.innerHTML;
              btn.innerHTML = originalHtml.replace('Copy Code', 'Copied!');
              setTimeout(() => {
                btn.innerHTML = originalHtml;
              }, 2000);
            });
          }
        });
      }
    });
  }, [html, slug]);

  if (!html) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Paper not found</div>
  }

  return (
    <>
      <SiteHeader />
      <div className="oai-page-enter" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  )

}
