require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB, seedMockData, db } = require('./database');
const { startWorkers } = require('./workers/sync');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDB();
seedMockData();

// Start Background Workers
startWorkers();

// ==========================================
// API ENDPOINTS
// ==========================================

app.get('/api/dashboard', (req, res) => {
    // Read from SQLite
    const keyword = req.query.keyword || 'custom stairs calgary';

    const seoMetrics = db.prepare('SELECT * FROM seo_metrics ORDER BY date DESC LIMIT 1').get();
    const mapsIntel = db.prepare('SELECT * FROM google_maps_intel ORDER BY date DESC LIMIT 1').get();
    const searchTrends = db.prepare('SELECT * FROM search_trends WHERE keyword = ? ORDER BY date ASC').all(keyword);
    const redditLeads = db.prepare('SELECT * FROM reddit_leads ORDER BY time DESC').all();
    const competitors = db.prepare('SELECT * FROM competitors WHERE keyword = ? ORDER BY position ASC').all(keyword);
    const aeoScores = db.prepare('SELECT * FROM aeo_scores ORDER BY date DESC LIMIT 3').all();
    const newsFeed = db.prepare('SELECT * FROM news_feed ORDER BY date DESC').all();

    // Calculate Brand Velocity
    let velocity = "+0%";
    let chartData = { labels: [], searchVolume: [] };
    if (searchTrends.length > 0) {
        chartData.labels = searchTrends.map(t => t.date);
        chartData.searchVolume = searchTrends.map(t => t.volume);
        const start = chartData.searchVolume[0];
        const end = chartData.searchVolume[chartData.searchVolume.length - 1];
        if (start > 0) {
            const v = Math.round(((end - start) / start) * 100);
            velocity = v >= 0 ? `+${v}%` : `${v}%`;
        }
    }

    res.json({
        brandVelocity: velocity,
        seoIntel: { domainAuthority: seoMetrics?.domain_authority, trustFlow: seoMetrics?.trust_flow },
        localIntel: { googleBusiness: { rating: mapsIntel?.rating, totalReviews: mapsIntel?.reviews } },
        threatIntel: { status: seoMetrics?.ssl_status, sslDaysRemaining: seoMetrics?.ssl_days, domainMaturity: seoMetrics?.domain_maturity },
        chartData,
        aeoIntel: { llmPerformance: aeoScores.map(a => ({ model: a.model, recommendationProbability: a.score })) },
        socialIntel: {
            redditFeed: redditLeads,
            youtubeFeed: [
                { title: `Top ${keyword} Ideas for 2026`, channel: "DIY Calgary", views: 347474, url: "#" }, 
                { title: "Ironwood Staircase Renovation", channel: "YYC Homes", views: 946, url: "#" }
            ],
            newsFeed: newsFeed,
            liveStream: [
                { source: "SYSTEM", text: "Dashboard connected to local cache DB." },
                { source: "WORKER", text: "Background cron jobs active." }
            ]
        },
        competitorIntel: competitors
    });
});

// Single Page App Fallback for React (Served by Render)
const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
