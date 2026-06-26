const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/KPICards.jsx', 'utf8');

if (!content.includes('import StatusBadge')) {
  content = content.replace(/import Tooltip from '\.\/Tooltip';/, "import Tooltip from './Tooltip';\nimport StatusBadge from './StatusBadge';");
}

// 1. Brand Velocity -> SIMULATED
content = content.replace(
  /Brand Velocity[\s\S]*?<span className="ml-2 text-\[8px\].*?REAL<\/span>/, 
  'Brand Velocity\n                      <StatusBadge type="simulated" />'
);

// 2. Google Maps -> SIMULATED
content = content.replace(
  /Google Maps Intel[\s\S]*?<span className="ml-2 text-\[8px\].*?REAL<\/span>/, 
  'Google Maps Intel\n                      <StatusBadge type="simulated" />'
);

// 3. Domain Maturity -> SIMULATED
content = content.replace(
  /Domain Maturity[\s\S]*?<span className="ml-2 text-\[8px\].*?REAL<\/span>/, 
  'Domain Maturity\n                      <StatusBadge type="simulated" />'
);

// 4. SSL -> LIVE
content = content.replace(
  /SSL Threat Intel[\s\S]*?<span className="ml-2 text-\[8px\].*?REAL<\/span>/, 
  'SSL Threat Intel\n                      <StatusBadge type="live" />'
);

fs.writeFileSync('frontend/src/components/KPICards.jsx', content);
console.log("KPICards updated.");
