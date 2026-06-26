const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'ironwood_seo.db'), { verbose: console.log });

function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS seo_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      domain_authority INTEGER,
      trust_flow INTEGER,
      ssl_status TEXT,
      ssl_days INTEGER,
      domain_maturity TEXT
    );

    CREATE TABLE IF NOT EXISTS google_maps_intel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      rating TEXT,
      reviews INTEGER
    );

    CREATE TABLE IF NOT EXISTS search_trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      keyword TEXT,
      volume INTEGER
    );

    CREATE TABLE IF NOT EXISTS reddit_leads (
      id TEXT PRIMARY KEY, -- using reddit post id or url as PK to avoid duplicates
      author TEXT,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      time TEXT,
      text TEXT,
      intent TEXT,
      url TEXT
    );

    CREATE TABLE IF NOT EXISTS competitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      keyword TEXT,
      domain TEXT,
      title TEXT,
      position INTEGER
    );

    CREATE TABLE IF NOT EXISTS aeo_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      model TEXT,
      score TEXT
    );

    CREATE TABLE IF NOT EXISTS news_feed (
      id TEXT PRIMARY KEY,
      title TEXT,
      date TEXT,
      url TEXT
    );
  `);
}

function seedMockData() {
  // Check if we already have data
  const row = db.prepare('SELECT count(*) as count FROM seo_metrics').get();
  if (row.count > 0) return;

  console.log("Seeding mock data...");

  // Seed SEO Metrics
  db.prepare('INSERT INTO seo_metrics (domain_authority, trust_flow, ssl_status, ssl_days, domain_maturity) VALUES (?, ?, ?, ?, ?)').run(
    42, 85, 'SECURE', 84, 'Active since 2013'
  );

  // Seed Google Maps
  db.prepare('INSERT INTO google_maps_intel (rating, reviews) VALUES (?, ?)').run('4.9', 60);

  // Seed Search Trends
  const insertTrend = db.prepare('INSERT INTO search_trends (date, keyword, volume) VALUES (?, ?, ?)');
  insertTrend.run('2026-05-10', 'custom stairs calgary', 10);
  insertTrend.run('2026-05-17', 'custom stairs calgary', 25);
  insertTrend.run('2026-05-24', 'custom stairs calgary', 45);
  insertTrend.run('2026-05-31', 'custom stairs calgary', 95);
  insertTrend.run('2026-06-07', 'custom stairs calgary', 60);
  insertTrend.run('2026-06-14', 'custom stairs calgary', 80);

  // Seed Reddit Leads
  const insertReddit = db.prepare('INSERT INTO reddit_leads (id, author, date, time, text, intent, url) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertReddit.run('post1', 'yyc_builder', '2026-06-26 10:00:00', '2 hours ago', 'Anyone know a good contractor for custom stairs calgary? Need them for a new build in SW Calgary.', 'HOT LEAD', 'https://reddit.com/r/calgary/post1');
  insertReddit.run('post2', 'homeowner_calgary', '2026-06-25 10:00:00', '1 day ago', 'Got a quote for stairs, checking if Ironwood is good?', 'CHATTER', 'https://reddit.com/r/calgary/post2');

  // Seed AEO Scores
  const insertAEO = db.prepare('INSERT INTO aeo_scores (model, score) VALUES (?, ?)');
  insertAEO.run('ChatGPT-4o (Sim)', '85%');
  insertAEO.run('Perplexity (Sim)', '72%');
  insertAEO.run('Claude 3.5 (Sim)', '88%');

  // Seed Competitors
  const insertComp = db.prepare('INSERT INTO competitors (keyword, domain, title, position) VALUES (?, ?, ?, ?)');
  insertComp.run('custom stairs calgary', 'houzz.com', 'IRONWOOD STAIR & RAIL INC. - Project...', 2);
  insertComp.run('custom stairs calgary', 'calgaryarea.com', 'Ironwood Stair & Rail Inc. - Calgary...', 4);
  insertComp.run('custom stairs calgary', 'greatstairs.com', 'Stairs, Spindles & Railings - local...', 7);
  
  // Seed News
  const insertNews = db.prepare('INSERT INTO news_feed (id, title, date, url) VALUES (?, ?, ?, ?)');
  insertNews.run('news1', 'The biggest night of the year for Calgary building industry', '2026-04-13 10:00:00', 'https://news.google.com/1');
  insertNews.run('news2', 'Pilot project takes aim at Calgary hail, wind damage', '2026-04-10 10:00:00', 'https://news.google.com/2');
}

module.exports = {
  db,
  initDB,
  seedMockData
};
