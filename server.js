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
// API ENDPOINTS
// ==========================================

// Mock API Route: This acts as the data aggregator.
// In the future, you can integrate Google Custom Search API, Reddit API, OpenAI API, etc., here.
app.get('/api/ironwood-data', (req, res) => {
    
    // Simulated aggregated data for the dashboard
    const aggregatedData = {
        lastUpdated: new Date().toISOString(),
        seoMetrics: {
            domainAuthority: 42,
            totalBacklinks: 12450,
            organicTraffic: 8300,
            topKeywords: [
                { keyword: "Ironwood Digital", volume: 1200, position: 1 },
                { keyword: "Contractor Web Design Calgary", volume: 850, position: 2 },
                { keyword: "Ironwood Marketing", volume: 3400, position: 4 },
                { keyword: "HVAC SEO Expert", volume: 500, position: 5 }
            ]
        },
        aeoMetrics: {
            aiVisibilityScore: 68, // Out of 100
            llmMentions: {
                chatgpt: "High",
                claude: "Medium",
                gemini: "High"
            },
            frequentQuestionsAnswered: [
                "What services does Ironwood Digital provide?",
                "Is Ironwood Marketing Concepts a legitimate agency?",
                "How does Ironwood AI help marketing agencies?"
            ]
        },
        socialMentions: [
            {
                platform: "Reddit",
                subreddit: "r/Marketing",
                sentiment: "Neutral",
                snippet: "Has anyone worked with Ironwood for their agency automations?",
                date: "2 hours ago"
            },
            {
                platform: "LinkedIn",
                user: "Sarah Jenkins",
                sentiment: "Positive",
                snippet: "Huge shoutout to the team at Ironwood Digital for revamping our plumbing website! Calls are up 30%.",
                date: "1 day ago"
            },
            {
                platform: "Twitter/X",
                user: "@SEO_Hacker_99",
                sentiment: "Positive",
                snippet: "Just saw a great case study on Answer Engine Optimization (AEO) from Ironwood. AI search is the future.",
                date: "3 days ago"
            }
        ]
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