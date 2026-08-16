import fs from 'fs';

const markup = fs.readFileSync('src/site/markup.html', 'utf8');

// Extract header
const headerMatch = markup.match(/<!-- ===== HEADER ===== -->[\s\S]*?<\/header>/);
const mobileMenuMatch = markup.match(/<!-- Mobile Menu -->[\s\S]*?<\/div>\s*<main>/);

// Extract footer
const footerMatch = markup.match(/<!-- ===== FOOTER ===== -->[\s\S]*?<\/footer>/);

let headerHtml = headerMatch ? headerMatch[0] : '';
let mobileMenuHtml = mobileMenuMatch ? mobileMenuMatch[0].replace('<main>', '') : '';
let footerHtml = footerMatch ? footerMatch[0] : '';

// Write to files so Vite can import them
fs.writeFileSync('src/site/header.html', headerHtml + mobileMenuHtml);
fs.writeFileSync('src/site/footer.html', footerHtml);

// Update team.tsx
let teamTsx = fs.readFileSync('src/routes/team.tsx', 'utf8');

if (!teamTsx.includes('headerHtml')) {
  teamTsx = `import headerHtml from '../site/header.html?raw'
import footerHtml from '../site/footer.html?raw'
` + teamTsx;
}

const componentRegex = /function TeamComponent\(\) \{[\s\S]*?return \([\s\S]*?<div style=\{\{ minHeight: '100vh', background: '#fff' \}\}>[\s\S]*?<div dangerouslySetInnerHTML=\{\{ __html: teamHtml \}\} \/>[\s\S]*?<\/div>[\s\S]*?\)/;

const newComponent = `function TeamComponent() {
  React.useEffect(() => {
    // Reload script for mobile menu and header scroll
    const script = document.createElement("script");
    script.src = "/site/script.js";
    script.async = false;
    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div dangerouslySetInnerHTML={{ __html: headerHtml }} />
      <div dangerouslySetInnerHTML={{ __html: teamHtml }} />
      <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
    </div>
  )
}`;

teamTsx = teamTsx.replace(componentRegex, newComponent);
fs.writeFileSync('src/routes/team.tsx', teamTsx);
console.log("Added header and footer to team.tsx");
