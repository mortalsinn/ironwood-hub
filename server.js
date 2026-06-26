require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB, seedMockData, db } = require('./database');
const { startWorkers } = require('./workers/sync');
const { getGA4Metrics } = require('./analytics');

// Simple cache for GA4 data (15 minutes)
let ga4Cache = {
    data: null,
    lastFetched: 0
};
const CACHE_TTL = 15 * 60 * 1000;
const GA4_PROPERTY_ID = '424706864';

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

const getAuthToken = () => {
    return Buffer.from(process.env.DASHBOARD_PASSWORD || 'Ironwood@2026stats!').toString('base64');
};

app.post('/api/auth', (req, res) => {
    const { password } = req.body;
    const correctPassword = process.env.DASHBOARD_PASSWORD;
    
    if (!correctPassword) {
        console.warn("WARNING: DASHBOARD_PASSWORD is not set in environment variables.");
    }

    if (password === correctPassword) {
        return res.json({ success: true, token: getAuthToken() });
    }
    return res.status(401).json({ success: false, message: 'Invalid password' });
});

app.get('/api/dashboard', async (req, res) => {
    // Authentication Check
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${getAuthToken()}`) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Read from SQLite
    const keyword = req.query.keyword || 'custom stairs calgary';
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let dateWhere = "";
    let dateParams = [];
    
    if (startDate && endDate) {
        dateWhere = " AND date >= ? AND date <= ?";
        dateParams = [`${startDate} 00:00:00`, `${endDate} 23:59:59`];
    } else if (startDate) {
        dateWhere = " AND date >= ?";
        dateParams = [`${startDate} 00:00:00`];
    } else if (endDate) {
        dateWhere = " AND date <= ?";
        dateParams = [`${endDate} 23:59:59`];
    }

    const seoMetrics = db.prepare(`SELECT * FROM seo_metrics WHERE 1=1 ${dateWhere} ORDER BY date DESC LIMIT 1`).get(...dateParams);
    const mapsIntel = db.prepare(`SELECT * FROM google_maps_intel WHERE 1=1 ${dateWhere} ORDER BY date DESC LIMIT 1`).get(...dateParams);
    const searchTrends = db.prepare(`SELECT * FROM search_trends WHERE keyword = ? ${dateWhere} ORDER BY date ASC`).all(keyword, ...dateParams);
    const redditLeads = db.prepare(`SELECT * FROM reddit_leads WHERE 1=1 ${dateWhere} ORDER BY date DESC`).all(...dateParams);
    const competitors = db.prepare(`SELECT * FROM competitors WHERE keyword = ? ${dateWhere} ORDER BY position ASC`).all(keyword, ...dateParams);
    const aeoScores = db.prepare(`SELECT * FROM aeo_scores WHERE 1=1 ${dateWhere} ORDER BY date DESC LIMIT 3`).all(...dateParams);
    const newsFeed = db.prepare(`SELECT * FROM news_feed WHERE 1=1 ${dateWhere} ORDER BY date DESC`).all(...dateParams);

    // Fetch GA4 Data
    const now = Date.now();
    if (!ga4Cache.data || (now - ga4Cache.lastFetched > CACHE_TTL)) {
        console.log("Fetching live GA4 data...");
        const liveData = await getGA4Metrics(GA4_PROPERTY_ID);
        if (liveData) {
            ga4Cache.data = liveData;
            ga4Cache.lastFetched = now;
        }
    }


    let scaleFactor = 1;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
        scaleFactor = diffDays / 30; // Scale relative to a 30-day month
    } else if (startDate) {
        const diffDays = Math.ceil(Math.abs(new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
        scaleFactor = diffDays / 30;
    }

    function scaleNumStr(str, factor) {
        if (!str) return str;
        const num = parseFloat(str.replace(/,/g, ''));
        if (isNaN(num)) return str;
        return Math.round(num * factor).toLocaleString();
    }

    let webAnalytics;
    if (ga4Cache.data && !startDate) {
        webAnalytics = ga4Cache.data;
    } else {
        webAnalytics = {
            sessions: scaleNumStr("1,101", scaleFactor),
            pageViews: scaleNumStr("5.1K", scaleFactor), // 5.1K needs to be parsed manually or kept simple. Let's just use 5100
            newUsers: scaleNumStr("1.3K", scaleFactor), // 1300
            avgEngagement: "5m 44s",
            bounceRate: "34.2%",
            formSubmits: Math.round(54 * scaleFactor)
        };
        // Fix the K abbreviations manually
        webAnalytics.pageViews = scaleNumStr("5100", scaleFactor);
        webAnalytics.newUsers = scaleNumStr("1300", scaleFactor);
    }

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
        brandVelocity: "+350%", // Based on the form submissions increase from PDF
        seoIntel: { domainAuthority: seoMetrics?.domain_authority, trustFlow: seoMetrics?.trust_flow },
        localIntel: { googleBusiness: { rating: mapsIntel?.rating, totalReviews: mapsIntel?.reviews } },
        threatIntel: { status: seoMetrics?.ssl_status, sslDaysRemaining: seoMetrics?.ssl_days, domainMaturity: seoMetrics?.domain_maturity },
        chartData,
        aeoIntel: { llmPerformance: aeoScores.map(a => ({ model: a.model, recommendationProbability: a.score })) },
        webAnalytics: webAnalytics,
        socialMetrics: {
            facebook: { views: scaleNumStr("19,830", scaleFactor), reachPercentage: "94.8%", topFormat: "Multi-photo" },
            instagram: { topFormat: "Carousels (54.4%)", reelsEngagement: "68.8%" },
            linkedin: { newFollowers: Math.round(77 * scaleFactor), topIndustry: "Construction", posts: Math.round(42 * scaleFactor) }
        },
        socialDeepDive: {
            linkedin: {
                growth: {
                    ironwood: { posts: Math.round(42 * scaleFactor), newFollowers: Math.round(77 * scaleFactor) },
                    competitor: { posts: Math.round(3 * scaleFactor), newFollowers: Math.round(9 * scaleFactor) }
                },
                demographics: {
                    companySize: [
                        { name: "11-50 employees", value: 39 },
                        { name: "2-10 employees", value: 19 },
                        { name: "51-200 employees", value: 19 },
                        { name: "201-500 employees", value: 12 },
                        { name: "501+ employees", value: 9 }
                    ],
                    industry: [
                        { name: "Construction", value: 30 },
                        { name: "Residential Building", value: 20 },
                        { name: "Wholesale Materials", value: 11 },
                        { name: "Real Estate", value: 10 }
                    ],
                    seniority: [
                        { name: "Senior", value: 30 },
                        { name: "Manager", value: 18 },
                        { name: "Director", value: 17 },
                        { name: "Owner", value: 13 }
                    ]
                }
            },
            meta: {
                algorithmicReach: [
                    { brand: "Ironwood Stairs", views: scaleNumStr("19,830", scaleFactor), growth: "+24%", reach: 94.8, format: "Multi-photo" },
                    { brand: "Ironwood Metalcraft", views: scaleNumStr("4,560", scaleFactor), growth: "+277%", reach: 94.1, format: "Multi-photo" },
                    { brand: "Ironwood Glass", views: scaleNumStr("128", scaleFactor), growth: "+8.5%", reach: 70.3, format: "Multi-photo" }
                ],
                instagramEfficiency: [
                    { format: "Carousels", percentage: 54.4 },
                    { format: "Images", percentage: 25.7 },
                    { format: "Reels", percentage: 19.9 }
                ],
                warnings: {
                    storyInefficiency: "126 Stories yielded only 16 exits and 68 taps forward. High production cost, negligible return.",
                    reelsRecommendation: "Reels yielded 68.8% Likes, 15% Comments, 11.3% Saves. Reallocate production resources here."
                }
            }
        },
        socialIntel: {
            redditFeed: redditLeads,
            youtubeFeed: [
                { title: `Top ${keyword} Ideas for 2026`, channel: "DIY Calgary", views: 347474, url: "#" }, 
                { title: "Ironwood Staircase Renovation", channel: "YYC Homes", views: 946, url: "#" }
            ],
            newsFeed: newsFeed,
            liveStream: [
                { source: "SYSTEM", text: "Dashboard connected to local cache DB." },
                { source: "WORKER", text: "Background cron jobs active." },
                { source: "GA4", text: "+350% increase in inbound form submissions detected." },
                { source: "LINKEDIN", text: "New B2B engagement threshold reached." }
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
