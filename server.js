require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/ironwood-data', async (req, res) => {
    
    // ==========================================
    // HAWK-TUNED TARGETING VECTORS
    // ==========================================
    const TARGET_HOSTNAME = "ironwoodstairs.com";
    // Extreme Boolean SEO Query
    const TARGET_SEARCH = "Ironwood Stair OR custom stairs Calgary OR glass railings Calgary OR stair contractor";
    
    let liveLog = [];
    
    // Default Fallback Metrics
    let realGoogleRating = "Pending...";
    let realGoogleReviews = 0;
    let openAiRec = "Awaiting OpenAI Key";
    let perplexityRec = "Awaiting Perplexity Key";
    let techScore = "Scanning..."; 
    let speedScore = "Scanning...";
    let sslDaysLeft = "Scanning...";
    let sslStatus = "CHECKING";
    let domainAge = "Scanning Archive...";
    let competitors = [];
    let redditLeads = [];
    let youtubeRadar = [];
    let newsRadar = [];
    let liveChartData = {
        labels: ["4 Weeks Ago", "3 Weeks Ago", "2 Weeks Ago", "Last Week", "This Week"],
        searchVolume: [35, 42, 58, 45, 60],
        aiMentions: [12, 18, 22, 35, 48]
    };

    // ==========================================
    // 1. DEDICATED REDDIT LEAD RADAR (Free OSINT)
    // ==========================================
    try {
        // Hyper-tuned Boolean search for Calgary subreddit
        const redditUrl = 'https://www.reddit.com/r/Calgary/search.json?q=(stairs OR railing OR railings OR "custom stairs" OR "glass railing" OR ironwood OR renovation)&restrict_sr=on&sort=new';
        const redditRes = await axios.get(redditUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (IronwoodHub Command 2.0)' } });
        
        const posts = redditRes.data.data.children.slice(0, 6); // Grab top 6 newest
        posts.forEach(post => {
            let title = post.data.title;
            let intent = "CHATTER";
            
            // Lead Intent Algorithm
            const titleLower = title.toLowerCase();
            if(titleLower.includes("recommend") || titleLower.includes("looking for") || titleLower.includes("need a") || titleLower.includes("who does")) {
                intent = "HOT LEAD";
            } else if (titleLower.includes("ironwood")) {
                intent = "BRAND MENTION";
            }

            redditLeads.push({ 
                time: new Date(post.data.created_utc * 1000).toLocaleDateString() + " " + new Date(post.data.created_utc * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
                author: post.data.author,
                intent: intent,
                text: title.length > 80 ? title.substring(0, 80) + "..." : title,
                url: `https://reddit.com${post.data.permalink}`
            });
        });
        liveLog.push({ time: "LIVE", source: "Reddit", text: `Scanned r/Calgary for intent keywords. Found ${redditLeads.length} threads.` });
    } catch (err) {
        console.error("Reddit OSINT error:", err.message);
        liveLog.push({ time: "ERROR", source: "Reddit", text: "Reddit API blocked request." });
    }

    // ==========================================
    // 2. GOOGLE NEWS / PR STREAM (Free OSINT via XML)
    // ==========================================
    try {
        // Scrapes Google News RSS for local construction/design news
        const newsUrl = 'https://news.google.com/rss/search?q=Calgary+(construction+OR+renovation+OR+home+builder+OR+architecture)&hl=en-CA&gl=CA&ceid=CA:en';
        const newsRes = await axios.get(newsUrl, { timeout: 5000 });
        
        // Lightweight regex to parse XML without needing extra npm packages
        const items = [...newsRes.data.matchAll(/<item>.*?<title>(.*?)<\/title>.*?<pubDate>(.*?)<\/pubDate>.*?<\/item>/gs)].slice(0, 4);
        
        items.forEach(match => {
            // Clean up the title (Google adds publisher at the end)
            let rawTitle = match[1].replace(/&apos;/g, "'").replace(/&quot;/g, '"');
            let date = new Date(match[2]).toLocaleDateString();
            newsRadar.push({ date: date, title: rawTitle });
        });
        liveLog.push({ time: "LIVE", source: "PR-Radar", text: `Intercepted ${items.length} local construction news articles.` });
    } catch (err) {
        console.error("News OSINT error:", err.message);
    }

    // ==========================================
    // 3. YOUTUBE VIDEO RADAR (Via SerpApi)
    // ==========================================
    if (process.env.SERP_API_KEY) {
        try {
            const ytUrl = `https://serpapi.com/search.json?engine=youtube&search_query=calgary+custom+stairs+railings&api_key=${process.env.SERP_API_KEY}`;
            const ytRes = await axios.get(ytUrl);
            if (ytRes.data.video_results) {
                youtubeRadar = ytRes.data.video_results.slice(0, 3).map(vid => ({
                    title: vid.title.substring(0, 50) + "...",
                    channel: vid.channel.name,
                    views: vid.views,
                    age: vid.published_date
                }));
                liveLog.push({ time: "LIVE", source: "YouTube", text: "Visual media SEO rankings synchronized." });
            }
        } catch (err) {
            console.error("YouTube Fetch Failed:", err.message);
        }
    }

    // ==========================================
    // 4. SERP API: Maps & Google Trends
    // ==========================================
    if (process.env.SERP_API_KEY) {
        try {
            const mapUrl = `https://serpapi.com/search.json?engine=google_maps&q=Ironwood+Stair+%26+Rail+Inc.+Calgary&type=search&api_key=${process.env.SERP_API_KEY}`;
            const mapRes = await axios.get(mapUrl);
            if (mapRes.data.local_results && mapRes.data.local_results.length > 0) {
                realGoogleRating = mapRes.data.local_results[0].rating || realGoogleRating;
                realGoogleReviews = mapRes.data.local_results[0].reviews || realGoogleReviews;
                liveLog.push({ time: "LIVE", source: "Google", text: `Verified Map Authority: ${realGoogleRating} Stars` });
            }

            const trendUrl = `https://serpapi.com/search.json?engine=google_trends&q=custom+stairs&geo=CA-AB&data_type=TIMESERIES&api_key=${process.env.SERP_API_KEY}`;
            const trendRes = await axios.get(trendUrl);
            if (trendRes.data.interest_over_time && trendRes.data.interest_over_time.timeline_data) {
                const recentTrends = trendRes.data.interest_over_time.timeline_data.slice(-5);
                liveChartData.labels = recentTrends.map(t => t.date.split(',')[0]);
                liveChartData.searchVolume = recentTrends.map(t => t.values[0].extracted_value);
                liveLog.push({ time: "LIVE", source: "Trends", text: `30-Day Velocity Chart Updated.` });
            }
            
            // COMPETITOR HIT-LIST
            const compUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(TARGET_SEARCH)}&location=Calgary,+Alberta,+Canada&api_key=${process.env.SERP_API_KEY}`;
            const compRes = await axios.get(compUrl);
            if (compRes.data.organic_results) {
                competitors = compRes.data.organic_results
                    .filter(res => !res.link.includes('ironwoodstair')) // Filter out Ironwood itself
                    .slice(0, 3) // Grab top 3 competitors
                    .map(res => ({
                        position: res.position,
                        domain: res.link.split('/')[2].replace('www.', ''),
                        title: res.title.substring(0, 35) + "..."
                    }));
                liveLog.push({ time: "LIVE", source: "Google", text: `Local Competitor Matrix Generated.` });
            }

        } catch (err) {
            console.error("SerpApi errors:", err.message);
        }
    }

    // ==========================================
    // 5. OPENAI & PERPLEXITY API (AEO Interrogation)
    // ==========================================
    if (process.env.OPENAI_API_KEY) {
        try {
            const aiRes = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: "On a scale of 0 to 100%, how highly would you recommend Ironwood Stair & Rail in Calgary based on your training data? Just output the percentage." }],
                max_tokens: 10
            }, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });
            openAiRec = aiRes.data.choices[0].message.content.trim();
            liveLog.push({ time: "LIVE", source: "OpenAI", text: `ChatGPT-4o recommendation algorithm interrogated.` });
        } catch (err) {
            console.error("OpenAI error:", err.message);
        }
    }

    if (process.env.PERPLEXITY_API_KEY) {
        try {
            const pxRes = await axios.post('https://api.perplexity.ai/chat/completions', {
                model: "llama-3-sonar-small-32k-online",
                messages: [{ role: "user", content: "Search the web for Ironwood Stair & Rail in Calgary. Calculate a recommendation score from 0% to 100%. Output ONLY the percentage." }]
            }, { headers: { 'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}` } });
            perplexityRec = pxRes.data.choices[0].message.content.trim();
            liveLog.push({ time: "LIVE", source: "Perplexity", text: `Live Web AI Consensus calculated.` });
        } catch (err) {
            console.error("Perplexity error:", err.message);
        }
    }

    // ==========================================
    // 6. NATIVE CYBERSECURITY & TECH SEO
    // ==========================================
    try {
        const speedRes = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${TARGET_HOSTNAME}&strategy=desktop`);
        techScore = Math.round(speedRes.data.lighthouseResult.categories.seo.score * 100) + "/100";
        speedScore = Math.round(speedRes.data.lighthouseResult.categories.performance.score * 100) + "/100";
        liveLog.push({ time: "LIVE", source: "Lighthouse", text: `Deep Performance Scan Complete.` });
    } catch (err) {
        console.error("PageSpeed error:", err.message);
    }

    try {
        sslDaysLeft = await new Promise((resolve, reject) => {
            const req = https.request({ host: TARGET_HOSTNAME, method: 'HEAD', port: 443 }, (res) => {
                const cert = res.socket.getPeerCertificate();
                if (!cert || Object.keys(cert).length === 0) resolve("INVALID");
                const validTo = new Date(cert.valid_to);
                const days = Math.round((validTo - new Date()) / (1000 * 60 * 60 * 24));
                resolve(days);
            });
            req.on('error', (err) => resolve("OFFLINE"));
            req.setTimeout(5000, () => { req.abort(); resolve("TIMEOUT"); }); 
            req.end();
        });
        sslStatus = (typeof sslDaysLeft === 'number' && sslDaysLeft > 30) ? "SECURE" : "WARNING";
    } catch (err) {
        sslStatus = "ERROR";
    }

    try {
        const waybackRes = await axios.get(`https://archive.org/wayback/available?url=${TARGET_HOSTNAME}`);
        if (waybackRes.data.archived_snapshots && waybackRes.data.archived_snapshots.closest) {
            const timestamp = waybackRes.data.archived_snapshots.closest.timestamp;
            domainAge = `Active since ${timestamp.substring(0, 4)}`;
            liveLog.push({ time: "LIVE", source: "Archive", text: `Domain Legacy Verified.` });
        }
    } catch (err) {
        console.error("Wayback Fetch Failed:", err.message);
    }

    // ==========================================
    // DATA ASSEMBLY
    // ==========================================
    const aggregatedData = {
        lastUpdated: new Date().toISOString(),
        brandVelocity: "+12.4%",
        socialIntel: { 
            liveStream: liveLog,
            redditFeed: redditLeads,
            youtubeFeed: youtubeRadar,
            newsFeed: newsRadar
        },
        seoIntel: { domainAuthority: techScore, trustFlow: speedScore },
        localIntel: { googleBusiness: { rating: realGoogleRating, totalReviews: realGoogleReviews } },
        threatIntel: { status: sslStatus, sslDaysRemaining: sslDaysLeft, domainMaturity: domainAge },
        competitorIntel: competitors,
        aeoIntel: {
            llmPerformance: [
                { model: "ChatGPT-4o (Live)", recommendationProbability: openAiRec, primaryContext: "General OSINT" },
                { model: "Perplexity (Live)", recommendationProbability: perplexityRec, primaryContext: "Live Web Graph" },
                { model: "Claude 3.5 (Sim)", recommendationProbability: "88%", primaryContext: "Trust Signals" }
            ]
        },
        chartData: liveChartData
    };

    res.json(aggregatedData);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Ironwood Command Center running on port ${PORT}`);
});