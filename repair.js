import fs from 'fs';
import { parse } from 'node-html-parser';

// 1. REVERT markup.html
let currentMarkup = fs.readFileSync('src/site/markup.html', 'utf8');
const originalMarkup = fs.readFileSync('C:/Users/as030/.gemini/antigravity/brain/e466422d-0e13-4033-b70f-f6bcc710a48c/scratch/old_site/index.html', 'utf8');

// Extract the original logos-section from old_site/index.html
const oldRoot = parse(originalMarkup);
const originalTeamSection = oldRoot.querySelector('#team');
if (!originalTeamSection) {
    console.error("Could not find #team in original markup");
    process.exit(1);
}
let originalTeamHtml = originalTeamSection.toString();
// Remember we updated aws.webp to aws.svg in markup.html earlier
originalTeamHtml = originalTeamHtml.replace('aws.webp', 'aws.svg');

// In currentMarkup, find the injected <main id="team"> and its preceding CSS links
// We know it starts with <link rel="stylesheet" ... and ends with </main>
const currentRoot = parse(currentMarkup);
const injectedTeamNode = currentRoot.querySelector('#team');
if (injectedTeamNode) {
    // We will just do a string replacement.
    // The injected part looks like: <link rel="stylesheet" href="...">...<main id="team">...</main>
    const injectedStrRegex = /(<link rel="stylesheet"[^>]+>\n*)+<main id="team">[\s\S]*?<\/main>/;
    if (injectedStrRegex.test(currentMarkup)) {
        currentMarkup = currentMarkup.replace(injectedStrRegex, originalTeamHtml);
    } else {
        // Fallback: just replace <main id="team">...</main>
        const fallbackRegex = /<main id="team">[\s\S]*?<\/main>/;
        currentMarkup = currentMarkup.replace(fallbackRegex, originalTeamHtml);
    }
}

// Update the navigation link in markup.html to point to /team instead of #team
currentMarkup = currentMarkup.replace(/<a class="nav-link" href="#team">Team<\/a>/g, '<a class="nav-link" href="/team">Team</a>');
currentMarkup = currentMarkup.replace(/<a class="mobile-nav-link" href="#team">Team<\/a>/g, '<a class="mobile-nav-link" href="/team">Team</a>');

// The Vercel CSS that we injected earlier might still be floating around if regex failed to catch all of it.
// Let's strip out any Vercel css links just in case
currentMarkup = currentMarkup.replace(/<link rel="stylesheet" href="https:\/\/tcet-openai-it\.vercel\.app\/_next\/static\/immutable\/chunks\/[^>]+>\n?/g, '');

fs.writeFileSync('src/site/markup.html', currentMarkup);
console.log('Reverted markup.html and updated links');


// 2. CREATE team_page_body.html
const vercelHtml = fs.readFileSync('team_page.html', 'utf8');
const vercelRoot = parse(vercelHtml);
const mainNode = vercelRoot.querySelector('main');

// Fix image links
mainNode.querySelectorAll('img').forEach(img => {
  const src = img.getAttribute('src');
  if (src && src.startsWith('/_next')) {
    img.setAttribute('src', 'https://tcet-openai-it.vercel.app' + src);
  }
  const srcSet = img.getAttribute('srcSet');
  if (srcSet) {
    const newSrcSet = srcSet.split(',').map(s => {
      const parts = s.trim().split(' ');
      if (parts[0].startsWith('/_next')) {
        parts[0] = 'https://tcet-openai-it.vercel.app' + parts[0];
      }
      return parts.join(' ');
    }).join(', ');
    img.setAttribute('srcSet', newSrcSet);
  }
});

let cssHtml = '';
vercelRoot.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
  let href = link.getAttribute('href');
  if (href.startsWith('/')) {
    href = 'https://tcet-openai-it.vercel.app' + href;
  }
  cssHtml += `<link rel="stylesheet" href="${href}" />\n`;
});

// We wrap it in a div to ensure the CSS is applied
const finalHtml = cssHtml + '<div class="vercel-team-page geistsans_d5a4f12f-module__Ur3q_a__className antialiased">' + mainNode.toString() + '</div>';
fs.writeFileSync('src/site/team_page_body.html', finalHtml);
console.log('Created team_page_body.html');

// 3. CREATE src/routes/team.tsx
const routeContent = `import { createFileRoute } from '@tanstack/react-router'
import teamHtml from '../site/team_page_body.html?raw'
import React from 'react'

export const Route = createFileRoute('/team')({
  component: TeamComponent,
})

function TeamComponent() {
  
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div dangerouslySetInnerHTML={{ __html: teamHtml }} />
    </div>
  )
}
`;
fs.writeFileSync('src/routes/team.tsx', routeContent);
console.log('Created src/routes/team.tsx');
