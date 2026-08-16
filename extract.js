import fs from 'fs';
import { parse } from 'node-html-parser';

const html = fs.readFileSync('team_page.html', 'utf8');
const root = parse(html);

const mainNode = root.querySelector('main');
if (!mainNode) {
  console.log('No main tag found');
  process.exit(1);
}

// Convert Vercel's relative image URLs to absolute ones so they don't break
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

let mainHtml = mainNode.toString();
// Give it an id of team so the nav link works
mainHtml = mainHtml.replace('<main>', '<main id="team">');

// We also need the CSS
const links = root.querySelectorAll('link[rel="stylesheet"]');
let cssHtml = '';
links.forEach(link => {
  let href = link.getAttribute('href');
  if (href.startsWith('/')) {
    href = 'https://tcet-openai-it.vercel.app' + href;
  }
  cssHtml += `<link rel="stylesheet" href="${href}" />\n`;
});

// Now inject into markup.html
let markup = fs.readFileSync('src/site/markup.html', 'utf8');
// Find the old #team section and replace it
const oldTeamRegex = /<section class="logos-section" id="team">[\s\S]*?<\/section>/;

if (oldTeamRegex.test(markup)) {
  markup = markup.replace(oldTeamRegex, cssHtml + mainHtml);
} else {
  // just put it before </main>
  markup = markup.replace('</main>', cssHtml + mainHtml + '</main>');
}

fs.writeFileSync('src/site/markup.html', markup);
console.log('Successfully injected team content into markup.html');
