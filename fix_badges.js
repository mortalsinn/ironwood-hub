const fs = require('fs');

let grid = fs.readFileSync('frontend/src/components/DashboardGrid.jsx', 'utf8');

// Add import
if (!grid.includes('import StatusBadge')) {
  grid = grid.replace(/import Tooltip from '\.\/Tooltip';/, "import Tooltip from './Tooltip';\nimport StatusBadge from './StatusBadge';");
}

// 1. Search Trajectory -> SIMULATED
grid = grid.replace(
  /<span className="ml-3 text-\[8px\].*?REAL<\/span>/, 
  '<StatusBadge type="simulated" />'
);

// 2. AI Engine Matrix -> LIVE
grid = grid.replace(
  /<span className="ml-auto text-\[8px\].*?LIVE AEO<\/span>/, 
  '<StatusBadge type="live" />'
);

// 3. Lead Radar -> LIVE (it was marked SIMULATED incorrectly)
grid = grid.replace(
  /<span className="ml-3 text-\[8px\].*?SIMULATED<\/span>/, 
  '<StatusBadge type="live" />'
);

// 4. Network Scraper -> LIVE (it was marked REAL)
grid = grid.replace(
  /<span className="ml-auto text-\[8px\].*?REAL<\/span>/, 
  '<StatusBadge type="live" />'
);

// 5. Web Analytics -> SIMULATED (it was marked REAL)
grid = grid.replace(
  /<span className="ml-auto text-\[8px\].*?REAL<\/span>/, 
  '<StatusBadge type="simulated" />'
);

// 6. Social Engagement -> SIMULATED (it was marked REAL)
grid = grid.replace(
  /<span className="ml-auto text-\[8px\].*?REAL<\/span>/, 
  '<StatusBadge type="simulated" />'
);

// 7. Target Acquisition -> SIMULATED (it was marked REAL)
grid = grid.replace(
  /<span className="ml-auto text-\[8px\].*?REAL<\/span>/, 
  '<StatusBadge type="simulated" />'
);

// 8. System Diagnostics -> SIMULATED (it was marked SIMULATED)
grid = grid.replace(
  /<span className="ml-auto text-\[8px\].*?SIMULATED<\/span>/, 
  '<StatusBadge type="simulated" />'
);

fs.writeFileSync('frontend/src/components/DashboardGrid.jsx', grid);
console.log("DashboardGrid updated.");
