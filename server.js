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
        // 1. LIVE DATA FETCHING: REDDIT API (Pivoted to Construction/Stairs)
        let liveRedditPosts = [];
        try {
            // Hacking into Reddit's public JSON feed for local Calgary contracting intel
            const redditRes = await axios.get('https://www.reddit.com/r/Calgary/search.json?q=stairs+OR+railing+OR+renovation+OR+Ironwood&restrict_sr=on&sort=new&limit=4');
            
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

        // --- NEW: GOOGLE REVIEWS & LOCAL SEO VIA SERPAPI ---
        // This will only run once you add the SERP_API_KEY to Render
        let realGoogleRating = 4.9; // Fallback
        let realGoogleReviews = 128; // Fallback
        let serpLog = { time: "SYS", source: "Google", type: "Status", text: "Waiting for SerpApi Key to pull live reviews." };
        let liveNews = []; // NEW: Array to hold live local news

        if (process.env.SERP_API_KEY) {
            try {
                // Searching Google Maps specifically for Ironwood Stair & Rail in Calgary
                const serpUrl = `https://serpapi.com/search.json?engine=google_maps&q=Ironwood+Stair+%26+Rail+Inc+Calgary&api_key=${process.env.SERP_API_KEY}`;
                const serpRes = await axios.get(serpUrl);
                
                if (serpRes.data.place_results) {
                    realGoogleRating = serpRes.data.place_results.rating || realGoogleRating;
                    realGoogleReviews = serpRes.data.place_results.reviews || realGoogleReviews;
                    serpLog = { time: "LIVE", source: "Google", type: "Update", text: `Live Google Rating Synced: ${realGoogleRating} Stars (${realGoogleReviews} reviews).` };
                }

                // NEW: Fetching Live Local Construction News using the SAME SerpApi Key (Google News)
                const newsUrl = `https://serpapi.com/search.json?engine=google&q=Calgary+construction+OR+renovation+OR+stairs&tbm=nws&api_key=${process.env.SERP_API_KEY}`;
                const newsRes = await axios.get(newsUrl);
                if (newsRes.data.news_results) {
                    liveNews = newsRes.data.news_results.slice(0, 2).map(article => ({
                        time: "LIVE",
                        source: "G-News",
                        type: "Update",
                        text: article.title.substring(0, 65) + "..."
                    }));
                }
            } catch (err) {
                console.error("SerpApi Fetch Failed:", err.message);
                serpLog = { time: "ERROR", source: "Google", type: "Alert", text: "Failed to connect to Google Maps API." };
            }
        }

        // --- NEW: LIVE AEO (LLM INTERROGATION) VIA OPENAI ---
        let chatGptData = { model: "ChatGPT-4o", recommendationProbability: "85%", sentiment: "Positive", primaryContext: "Awaiting Live OpenAI Key" };
        let openaiLog = { time: "SYS", source: "OpenAI", type: "Status", text: "Waiting for OPENAI_API_KEY." };

        if (process.env.OPENAI_API_KEY) {
            try {
                const aiRes = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: "gpt-3.5-turbo",
                        messages: [
                            { 
                                role: "system", 
                                content: "You are an AI Answer Engine analyzing local businesses. A user asks about 'Ironwood Stair & Rail Inc' in Calgary. Respond strictly in JSON format with three keys: 'probability' (a percentage string like '92%'), 'sentiment' (Positive, Neutral, or Negative), and 'context' (a 2-3 word summary of why)." 
                            },
                            { 
                                role: "user", 
                                content: "Would you recommend Ironwood Stair & Rail in Calgary for custom stairs?" 
                            }
                        ]
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                // Parse the AI's JSON response
                const aiText = aiRes.data.choices[0].message.content;
                const aiParse = JSON.parse(aiText);
                
                chatGptData = { 
                    model: "ChatGPT (Live)", 
                    recommendationProbability: aiParse.probability || "80%", 
                    sentiment: aiParse.sentiment || "Positive", 
                    primaryContext: (aiParse.context || "Live Citation").substring(0, 25) 
                };
                openaiLog = { time: "LIVE", source: "OpenAI", type: "Scan", text: `Live ChatGPT AEO Scan Complete: ${chatGptData.recommendationProbability} Recommendation.` };
                
            } catch (err) {
                console.error("OpenAI Fetch Failed:", err.message);
                openaiLog = { time: "ERROR", source: "OpenAI", type: "Alert", text: "Failed to interrogate OpenAI API. Check API Credits." };
            }
        }

        // 2. AGGREGATING DATA (Merging Live APIs with our structural data)
        const aggregatedData = {
            lastUpdated: new Date().toISOString(),
            globalOmniScore: 94.2, 
            brandVelocity: "+18.4%", 
            
            seoIntel: {
                domainAuthority: 28,
                trustFlow: 22,
                indexedPages: 145,
                searchEngines: {
                    google: { organicTraffic: 1450, featuredSnippets: 2, indexingSpeed: "Under 24 hrs" },
                    bing: { organicTraffic: 310, copilotMentions: 4 },
                    duckDuckGo: { organicTraffic: 89 }
                },
                backlinkVelocity: { newThisWeek: 12, lostThisWeek: 2, toxicLinksBlocked: 0 },
                topCannibalizationRisks: 0
            },

            aeoIntel: {
                overallVisibility: 72,
                llmPerformance: [
                    chatGptData, // <--- INJECTING REAL LIVE OPENAI DATA HERE
                    { model: "Claude 3.5 Sonnet", recommendationProbability: "78%", sentiment: "Positive", primaryContext: "Calgary Contractors" },
                    { model: "Gemini Pro", recommendationProbability: "82%", sentiment: "Positive", primaryContext: "Metal Railings" },
                    { model: "Perplexity AI", recommendationProbability: "88%", sentiment: "Highly Positive", primaryContext: "Source Citation" }
                ],
                frequentQuestionsAnswered: [
                    "Who makes the best custom stairs in Calgary?",
                    "Are ironwood stair and rail reviews good?",
                    "Cost of glass railing installation Calgary."
                ]
            },

            socialIntel: {
                totalReach: "45K",
                engagementRate: "6.2%",
                platforms: {
                    linkedin: { followers: 420, weeklyMentions: 8, sentimentScore: 9.2 },
                    x: { followers: 150, weeklyMentions: 14, sentimentScore: 7.8 },
                    // If live posts exist, show that count. Otherwise default to 12.
                    reddit: { activeThreads: liveRedditPosts.length > 0 ? liveRedditPosts.length : 12, topSubreddits: ["r/Calgary", "r/HomeImprovement"], sentimentScore: 6.5 },
                    tiktok: { views: 4500, viralIndex: "Low", sentimentScore: 8.0 }
                },
                liveStream: [
                    ...liveRedditPosts, // <--- INJECTING REAL LIVE REDDIT DATA
                    ...liveNews, // <--- INJECTING REAL LIVE GOOGLE NEWS DATA
                    serpLog, // <--- INJECTING GOOGLE API STATUS
                    openaiLog, // <--- INJECTING OPENAI STATUS
                    { time: "3h ago", source: "Houzz", type: "Review", text: "New project photos indexed." },
                    { time: "5h ago", source: "Pinterest", type: "Pin", text: "Custom glass railing pin gained 40 impressions." }
                ]
            },

            localIntel: {
                // Now using our live variables!
                googleBusiness: { rating: realGoogleRating, totalReviews: realGoogleReviews, mapViewsThisMonth: 1450 },
                trustpilot: { rating: 4.8, totalReviews: 12 },
                yelp: { rating: 4.5, totalReviews: 5 }
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