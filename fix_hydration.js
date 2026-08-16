import fs from 'fs';

let html = fs.readFileSync('src/site/team_page_body.html', 'utf8');

// Extract all link tags
const links = [];
const linkRegex = /<link rel="stylesheet" href="([^"]+)" \/>\n?/g;
let match;
while ((match = linkRegex.exec(html)) !== null) {
  links.push(match[1]);
}

// Remove them from the HTML string
html = html.replace(linkRegex, '');
fs.writeFileSync('src/site/team_page_body.html', html);

let teamTsx = fs.readFileSync('src/routes/team.tsx', 'utf8');

// We need to add the links to the Route object
const linksArrayStr = links.map(href => `{ rel: 'stylesheet', href: '${href}' }`).join(',\n      ');

const routeLinksCode = `
export const Route = createFileRoute('/team')({
  component: TeamComponent,
  head: () => ({
    links: [
      ${linksArrayStr}
    ]
  })
})
`;

teamTsx = teamTsx.replace(/export const Route = createFileRoute\('\/team'\)\(\{\s*component: TeamComponent,?\s*\}\)/, routeLinksCode.trim());

fs.writeFileSync('src/routes/team.tsx', teamTsx);
console.log('Fixed team route hydration issue');
