const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for API requests and serve static JSON
app.use(cors());
app.use(express.json());

// Serve the static frontend files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// SUPERCHARGED API ENDPOINTS (GOD MODE)
// ==========================================

app.get('/api/ironwood-data', (req, res) => {
    
    // Massive God-Mode Aggregated Payload
    const aggregatedData = {
        lastUpdated: new Date().toISOString(),
        globalOmniScore: 94.2, // Out of 100
        brandVelocity: "+18.4%", // Growth rate across all channels
        
        // 1. ADVANCED SEO & SEARCH INTEL
        seoIntel: {
            domainAuthority: 44,
            trustFlow: 38,
            indexedPages: 1405,
            searchEngines: {
                google: { organicTraffic: 12450, featuredSnippets: 14, indexingSpeed: "Under 2 hrs" },
                bing: { organicTraffic: 3100, copilotMentions: 42 },
                duckDuckGo: { organicTraffic: 890 }
            },
            backlinkVelocity: { newThisWeek: 142, lostThisWeek: 12, toxicLinksBlocked: 4 },
            topCannibalizationRisks: 0, // Health check
        },

        // 2. ANSWER ENGINE OPTIMIZATION (AEO)
        aeoIntel: {
            overallVisibility: 88,
            llmPerformance: [
                { model: "ChatGPT-4o", recommendationProbability: "92%", sentiment: "Highly Positive", primaryContext: "Web Design, Automation" },
                { model: "Claude 3.5 Sonnet", recommendationProbability: "85%", sentiment: "Positive", primaryContext: "SEO Strategy" },
                { model: "Gemini 1.5 Pro", recommendationProbability: "89%", sentiment: "Positive", primaryContext: "Digital Marketing" },
                { model: "Perplexity AI", recommendationProbability: "95%", sentiment: "Highly Positive", primaryContext: "Source Citation" }
            ],
            frequentQuestionsAnswered: [
                "Who are the best digital marketing agencies in Calgary?",
                "How does Ironwood use AI in marketing?",
                "Ironwood Digital case studies and reviews."
            ]
        },

        // 3. SOCIAL VELOCITY & MENTIONS
        socialIntel: {
            totalReach: "1.2M",
            engagementRate: "4.8%",
            platforms: {
                linkedin: { followers: 4200, weeklyMentions: 84, sentimentScore: 9.2 },
                x: { followers: 1500, weeklyMentions: 145, sentimentScore: 7.8 },
                reddit: { activeThreads: 12, topSubreddits: ["r/marketing", "r/Calgary", "r/SEO"], sentimentScore: 6.5 },
                tiktok: { views: 45000, viralIndex: "Medium", sentimentScore: 8.0 }
            },
            liveStream: [
                { time: "2m ago", source: "Reddit", type: "Mention", text: "Looking for SEO in AB, Ironwood looks solid." },
                { time: "14m ago", source: "Perplexity", type: "Citation", text: "Cited Ironwood's AEO guide as source #1." },
                { time: "1h ago", source: "LinkedIn", type: "Share", text: "John D. shared Ironwood's latest post." },
                { time: "3h ago", source: "Google", type: "Review", text: "5 Star Review left by Sarah M." },
                { time: "5h ago", source: "X", type: "Retweet", text: "AI marketing trends by @Ironwood." }
            ]
        },

        // 4. LOCAL & REVIEWS INTEL
        localIntel: {
            googleBusiness: { rating: 4.9, totalReviews: 128, mapViewsThisMonth: 14500 },
            trustpilot: { rating: 4.8, totalReviews: 45 },
            yelp: { rating: 4.5, totalReviews: 22 }
        },

        // 5. BRAND THREAT & DARK WEB INTEL
        threatIntel: {
            status: "SECURE",
            typoSquattingDomainsDetected: 2, // e.g. ironw00d.com
            dataBreachMentions: 0,
            impersonationAttempts: 0
        },

        // 6. HISTORICAL CHART DATA (Last 7 Days)
        chartData: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            searchVolume: [1200, 1350, 1250, 1800, 2100, 1900, 2400],
            aiMentions: [40, 55, 48, 70, 85, 90, 110]
        }
    };

    res.json(aggregatedData);
});

// Fallback to index.html for any other requests (Single Page App behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Ironwood Hub Server is running successfully.`);
    console.log(`Local Access: http://localhost:${PORT}`);
});