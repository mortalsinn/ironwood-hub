const fs = require('fs');

function addBadge(file, searchStr, badgeType) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import StatusBadge')) {
    // find first import and add it after
    content = content.replace(/import .*?;/, "$&\nimport StatusBadge from '../components/StatusBadge';");
  }
  
  // Only add if not already added
  if (content.includes(`StatusBadge type="${badgeType}"`) && content.includes(searchStr)) {
    // might already be added
  } else {
    content = content.replace(searchStr, searchStr + `\n                <StatusBadge type="${badgeType}" />`);
  }
  fs.writeFileSync(file, content);
}

// LeadRadar.jsx -> r/Calgary Activity Feed -> LIVE
addBadge('frontend/src/pages/LeadRadar.jsx', 'r/Calgary Activity Feed', 'live');

// LocalPR.jsx -> Target Acquisition -> SIMULATED
addBadge('frontend/src/pages/LocalPR.jsx', 'Target Acquisition', 'simulated');
// LocalPR.jsx -> Media & PR Radar -> LIVE (or simulated depending on how you look at it, but let's do LIVE for the News)
addBadge('frontend/src/pages/LocalPR.jsx', 'Media & PR Radar', 'live');

// SocialEngagement.jsx 
addBadge('frontend/src/pages/SocialEngagement.jsx', 'Meta Platform Deep Dive', 'simulated');
addBadge('frontend/src/pages/SocialEngagement.jsx', 'LinkedIn Professional Graph', 'simulated');
addBadge('frontend/src/pages/SocialEngagement.jsx', 'Strategic Content Warnings', 'simulated');

// Diagnostics.jsx
// Has "Backlink & Authority Audit" -> we already added a manual badge there, let's replace it with StatusBadge.
let diag = fs.readFileSync('frontend/src/pages/Diagnostics.jsx', 'utf8');
if (!diag.includes('import StatusBadge')) {
  diag = diag.replace(/import Tooltip from '\.\/components\/Tooltip';/, "import Tooltip from '../components/Tooltip';\nimport StatusBadge from '../components/StatusBadge';");
}
diag = diag.replace(/<span className="bg-amber-100.*?Simulated<\/span>/, '<StatusBadge type="simulated" />');
// AEO matrix -> LIVE
diag = diag.replace('AEO Recommendation Matrix', 'AEO Recommendation Matrix\n                <StatusBadge type="live" />');
fs.writeFileSync('frontend/src/pages/Diagnostics.jsx', diag);

console.log("Pages updated.");
