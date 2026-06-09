require('dotenv').config(); // MUST BE AT THE VERY TOP to load secret API keys
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios'); // We use this to make HTTP requests to other APIs

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// SUPERCHARGED API ENDPOINTS (GOD MODE)
// ==========================================

app.get('/api/ironwood-data', async (req, res) => {
    
    try {
        // 1. LIVE DATA FETCHING: REDDIT API
        let liveRedditPosts = [];
        try {
            // Hacking into Reddit's public JSON feed for local marketing intel (r/Calgary)
            const redditRes = await axios.get('https://www.reddit.com/r/Calgary/search.json?q=SEO+OR+marketing+OR+Ironwood&restrict_sr=on&sort=new&limit=4');
            
            // Map the real Reddit data into our dashboard format
            liveRedditPosts = redditRes.data.data.children.map(post => ({
                time: "LIVE",
                source: "Reddit",
                type: "Alert",
                text: post.data.title.substring(0, 65) + "..." // Truncate long titles
            }));
        } catch (redditErr) {
            console.error("Reddit fetch failed:", redditErr.message);
            // If Reddit fails or rate-limits us, we leave the array empty and continue loading the dashboard
        }

        // 2. AGGREGATING DATA (Merging Live APIs with our structural data)
        const aggregatedData = {
            lastUpdated: new Date().toISOString(),
            globalOmniScore: 94.2, 
            brandVelocity: "+18.4%", 
            
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
                topCannibalizationRisks: 0,
            },

            aeoIntel: {
                overallVisibility: 88,
                llmPerformance: [
                    { model: "ChatGPT-4o", recommendationProbability: "92%", sentiment: "Highly Positive", primaryContext: "Web Design, Automation" },
                    { model: "Claude 3.5 Sonnet", recommendationProbability: "85%", sentiment: "Positive", primaryContext: "SEO Strategy" },
                    { model: "Gemini Pro", recommendationProbability: "89%", sentiment: "Positive", primaryContext: "Digital Marketing" },
                    { model: "Perplexity AI", recommendationProbability: "95%", sentiment: "Highly Positive", primaryContext: "Source Citation" }
                ],
                frequentQuestionsAnswered: [
                    "Who are the best digital marketing agencies in Calgary?",
                    "How does Ironwood use AI in marketing?",
                    "Ironwood Digital case studies and reviews."
                ]
            },

            socialIntel: {
                totalReach: "1.2M",
                engagementRate: "4.8%",
                platforms: {
                    linkedin: { followers: 4200, weeklyMentions: 84, sentimentScore: 9.2 },
                    x: { followers: 1500, weeklyMentions: 145, sentimentScore: 7.8 },
                    // If live posts exist, show that count. Otherwise default to 12.
                    reddit: { activeThreads: liveRedditPosts.length > 0 ? liveRedditPosts.length : 12, topSubreddits: ["r/marketing", "r/Calgary", "r/SEO"], sentimentScore: 6.5 },
                    tiktok: { views: 45000, viralIndex: "Medium", sentimentScore: 8.0 }
                },
                liveStream: [
                    ...liveRedditPosts, // <--- INJECTING REAL LIVE DATA HERE
                    { time: "14m ago", source: "Perplexity", type: "Citation", text: "Cited Ironwood's AEO guide as source #1." },
                    { time: "1h ago", source: "LinkedIn", type: "Share", text: "John D. shared Ironwood's latest post." },
                    { time: "3h ago", source: "Google", type: "Review", text: "5 Star Review left by Sarah M." },
                    { time: "5h ago", source: "X", type: "Retweet", text: "AI marketing trends by @Ironwood." }
                ]
            },

            localIntel: {
                googleBusiness: { rating: 4.9, totalReviews: 128, mapViewsThisMonth: 14500 },
                trustpilot: { rating: 4.8, totalReviews: 45 },
                yelp: { rating: 4.5, totalReviews: 22 }
            },

            threatIntel: {
                status: "SECURE",
                typoSquattingDomainsDetected: 2, 
                dataBreachMentions: 0,
                impersonationAttempts: 0
            },

            chartData: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                searchVolume: [1200, 1350, 1250, 1800, 2100, 1900, 2400],
                aiMentions: [40, 55, 48, 70, 85, 90, 110]
            }
        };

        res.json(aggregatedData);
    
    } catch (error) {
        // Handling Global Server API Errors
        console.error("Server API Error:", error);
        res.status(500).json({ error: "Failed to compile intelligence data. Check server logs." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Ironwood Hub Server is running successfully.`);
    console.log(`Local Access: http://localhost:${PORT}`);
});