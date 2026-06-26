const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(
`    // Read from SQLite
    const keyword = req.query.keyword || 'custom stairs calgary';

    const seoMetrics = db.prepare('SELECT * FROM seo_metrics ORDER BY date DESC LIMIT 1').get();
    const mapsIntel = db.prepare('SELECT * FROM google_maps_intel ORDER BY date DESC LIMIT 1').get();
    const searchTrends = db.prepare('SELECT * FROM search_trends WHERE keyword = ? ORDER BY date ASC').all(keyword);
    const redditLeads = db.prepare('SELECT * FROM reddit_leads ORDER BY time DESC').all();
    const competitors = db.prepare('SELECT * FROM competitors WHERE keyword = ? ORDER BY position ASC').all(keyword);
    const aeoScores = db.prepare('SELECT * FROM aeo_scores ORDER BY date DESC LIMIT 3').all();
    const newsFeed = db.prepare('SELECT * FROM news_feed ORDER BY date DESC').all();`,
`    // Read from SQLite
    const keyword = req.query.keyword || 'custom stairs calgary';
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let dateWhere = "";
    let dateParams = [];
    
    if (startDate && endDate) {
        dateWhere = " AND date >= ? AND date <= ?";
        dateParams = [\`\${startDate} 00:00:00\`, \`\${endDate} 23:59:59\`];
    } else if (startDate) {
        dateWhere = " AND date >= ?";
        dateParams = [\`\${startDate} 00:00:00\`];
    } else if (endDate) {
        dateWhere = " AND date <= ?";
        dateParams = [\`\${endDate} 23:59:59\`];
    }

    const seoMetrics = db.prepare(\`SELECT * FROM seo_metrics WHERE 1=1 \${dateWhere} ORDER BY date DESC LIMIT 1\`).get(...dateParams);
    const mapsIntel = db.prepare(\`SELECT * FROM google_maps_intel WHERE 1=1 \${dateWhere} ORDER BY date DESC LIMIT 1\`).get(...dateParams);
    const searchTrends = db.prepare(\`SELECT * FROM search_trends WHERE keyword = ? \${dateWhere} ORDER BY date ASC\`).all(keyword, ...dateParams);
    const redditLeads = db.prepare(\`SELECT * FROM reddit_leads WHERE 1=1 \${dateWhere} ORDER BY date DESC\`).all(...dateParams);
    const competitors = db.prepare(\`SELECT * FROM competitors WHERE keyword = ? \${dateWhere} ORDER BY position ASC\`).all(keyword, ...dateParams);
    const aeoScores = db.prepare(\`SELECT * FROM aeo_scores WHERE 1=1 \${dateWhere} ORDER BY date DESC LIMIT 3\`).all(...dateParams);
    const newsFeed = db.prepare(\`SELECT * FROM news_feed WHERE 1=1 \${dateWhere} ORDER BY date DESC\`).all(...dateParams);`);

// Replace the fallback mock logic with Option A simulator
const replacement2 = `
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
`;

code = code.replace(
`    // Default to mock data if GA4 fetch fails
    const webAnalytics = ga4Cache.data || {
        sessions: "1,101",
        pageViews: "5.1K",
        newUsers: "1.3K",
        avgEngagement: "5m 44s",
        bounceRate: "34.2%",
        formSubmits: 54
    };

    // Calculate Brand Velocity`, replacement2);

code = code.replace(
`        socialMetrics: {
            facebook: { views: "19,830", reachPercentage: "94.8%", topFormat: "Multi-photo" },
            instagram: { topFormat: "Carousels (54.4%)", reelsEngagement: "68.8%" },
            linkedin: { newFollowers: 77, topIndustry: "Construction", posts: 42 }
        },`,
`        socialMetrics: {
            facebook: { views: scaleNumStr("19,830", scaleFactor), reachPercentage: "94.8%", topFormat: "Multi-photo" },
            instagram: { topFormat: "Carousels (54.4%)", reelsEngagement: "68.8%" },
            linkedin: { newFollowers: Math.round(77 * scaleFactor), topIndustry: "Construction", posts: Math.round(42 * scaleFactor) }
        },`);

code = code.replace(
`                growth: {
                    ironwood: { posts: 42, newFollowers: 77 },
                    competitor: { posts: 3, newFollowers: 9 }
                },`,
`                growth: {
                    ironwood: { posts: Math.round(42 * scaleFactor), newFollowers: Math.round(77 * scaleFactor) },
                    competitor: { posts: Math.round(3 * scaleFactor), newFollowers: Math.round(9 * scaleFactor) }
                },`);

code = code.replace(
`                algorithmicReach: [
                    { brand: "Ironwood Stairs", views: "19,830", growth: "+24%", reach: 94.8, format: "Multi-photo" },
                    { brand: "Ironwood Metalcraft", views: "4,560", growth: "+277%", reach: 94.1, format: "Multi-photo" },
                    { brand: "Ironwood Glass", views: "128", growth: "+8.5%", reach: 70.3, format: "Multi-photo" }
                ],`,
`                algorithmicReach: [
                    { brand: "Ironwood Stairs", views: scaleNumStr("19,830", scaleFactor), growth: "+24%", reach: 94.8, format: "Multi-photo" },
                    { brand: "Ironwood Metalcraft", views: scaleNumStr("4,560", scaleFactor), growth: "+277%", reach: 94.1, format: "Multi-photo" },
                    { brand: "Ironwood Glass", views: scaleNumStr("128", scaleFactor), growth: "+8.5%", reach: 70.3, format: "Multi-photo" }
                ],`);

fs.writeFileSync('server.js', code);
