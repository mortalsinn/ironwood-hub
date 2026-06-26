require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');
const { ApifyClient } = require('apify-client');
const tls = require('tls');
const { XMLParser } = require('fast-xml-parser');
const { db } = require('../database');
const { evaluateAEO } = require('../aeo_evaluator');

// 1. Live SSL Sync
async function syncSSL() {
    console.log("[WORKER] Syncing SSL status for ironwoodstairs.com...");
    try {
        const hostname = 'ironwoodstairs.com';
        const cert = await new Promise((resolve, reject) => {
            const socket = tls.connect(443, hostname, { servername: hostname }, () => {
                resolve(socket.getPeerCertificate());
                socket.destroy();
            });
            socket.setTimeout(5000, () => {
                socket.destroy();
                reject(new Error("SSL Connection Timeout"));
            });
            socket.on('error', reject);
        });

        if (cert && cert.valid_to) {
            const validTo = new Date(cert.valid_to);
            const daysRemaining = Math.floor((validTo - Date.now()) / (1000 * 60 * 60 * 24));
            const status = daysRemaining > 14 ? 'SECURE' : 'WARNING';
            
            db.prepare(`UPDATE seo_metrics SET ssl_status = ?, ssl_days = ? WHERE id = (SELECT max(id) FROM seo_metrics)`).run(status, daysRemaining);
            console.log(`[WORKER] SSL Sync complete: ${daysRemaining} days left.`);
        }
    } catch (err) {
        console.error("[WORKER] SSL Sync failed:", err.message);
    }
}

// 2. Live Reddit Sync
async function syncReddit() {
    console.log("[WORKER] Syncing Reddit leads from r/calgary via Apify...");
    try {
        const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
        
        const input = {
            "startUrls": [
                {
                    "url": "https://www.reddit.com/r/calgary+alberta+airdrie/search/?q=%22Ironwood+Stairs%22+OR+%22Ironwood+Stair+%26+Rail%22+OR+%22Ironwood+Metalcraft%22+OR+%22Ironwood+Glass+Solutions%22+OR+%22Ironwood%22+OR+stairs+OR+railing+OR+railings&restrict_sr=1&sort=new"
                }
            ],
            "skipComments": true,
            "maxItems": 10
        };

        console.log("[WORKER] Calling Apify actor...");
        const run = await client.actor("trudax/reddit-scraper-lite").call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        
        // Clear old placeholders and previous leads so we only show fresh data
        db.prepare(`DELETE FROM reddit_leads`).run();
        
        const insert = db.prepare(`INSERT OR REPLACE INTO reddit_leads (id, author, date, time, text, intent, url) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        
        for (const post of items) {
            const text = (post.title || "") + (post.body ? " " + post.body : "");
            
            // Basic NLP intent matching
            const lowerText = text.toLowerCase();
            const isHotLead = /(quote|recommend|looking for|need|hire|cost|contractor)/.test(lowerText);
            const intent = isHotLead ? 'HOT LEAD' : 'CHATTER';
            
            // Format relative time 
            const createdDate = new Date(post.createdAt || Date.now());
            const hoursAgo = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 3600));
            const timeStr = hoursAgo <= 0 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo/24)} days ago`;

            // Max 150 chars text preview
            const textPreview = text.substring(0, 150) + (text.length > 150 ? '...' : '');
            const dateStr = createdDate.toISOString().replace('T', ' ').substring(0, 19);

            insert.run(
                post.id || Math.random().toString(36).substring(7), 
                post.author || "reddit_user", 
                dateStr,
                timeStr, 
                textPreview, 
                intent, 
                post.url || (post.permalink ? `https://reddit.com${post.permalink}` : "")
            );
        }
        console.log(`[WORKER] Reddit Sync complete: processed ${items.length} items from Apify.`);
    } catch (err) {
        console.error("[WORKER] Reddit Sync failed:", err.message);
    }
}

// 3. Live Google News PR Sync
async function syncNews() {
    console.log("[WORKER] Syncing Google News PR radar...");
    try {
        const url = 'https://news.google.com/rss/search?q=calgary+construction+OR+renovation+OR+stairs&hl=en-CA&gl=CA&ceid=CA:en';
        const res = await axios.get(url);
        
        const parser = new XMLParser();
        const obj = parser.parse(res.data);
        const items = obj.rss.channel.item.slice(0, 5); // top 5 news
        
        const insert = db.prepare(`INSERT OR REPLACE INTO news_feed (id, title, date, url) VALUES (?, ?, ?, ?)`);
        
        // Clear old news out for demo simplicity
        db.prepare('DELETE FROM news_feed').run();

        items.forEach((item, index) => {
            const isoDate = new Date(item.pubDate).toISOString().replace('T', ' ').substring(0, 19);
            insert.run(`news_${index}`, item.title, isoDate, item.link);
        });
        
        console.log(`[WORKER] News Sync complete. Added ${items.length} PR articles.`);
    } catch (err) {
        console.error("[WORKER] News Sync failed:", err.message);
    }
}


// 4. Live AEO Sync (Gemini)
async function syncAEO() {
    console.log("[WORKER] Syncing AI Engine Optimization (AEO) matrix...");
    try {
        // Check if an AEO score has already been fetched today to save API costs
        const todayStr = new Date().toISOString().substring(0, 10);
        const existing = db.prepare(`SELECT count(*) as count FROM aeo_scores WHERE model = 'Gemini 2.5 (Live)' AND date LIKE ?`).get(`${todayStr}%`);
        
        if (existing.count > 0) {
            console.log("[WORKER] AEO Sync skipped: Gemini was already queried today.");
            return;
        }

        const keywords = ['custom stairs calgary', 'glass railings calgary']; // Evaluate top targets
        const insert = db.prepare(`INSERT INTO aeo_scores (model, score) VALUES (?, ?)`);
        
        // We will evaluate each keyword and take an average, or just pick the top one for simplicity.
        // For the dashboard UI we typically just display one overall score or breakdown by LLM. 
        // We will use Gemini-2.5-Flash to simulate different engines, or just present it as Gemini's rating.
        const score = await evaluateAEO(keywords[0]);
        
        if (score !== "N/A") {
            // Delete old scores for Gemini to keep it fresh
            db.prepare(`DELETE FROM aeo_scores WHERE model = 'Gemini 2.5 (Live)'`).run();
            insert.run('Gemini 2.5 (Live)', score);
            console.log(`[WORKER] AEO Sync complete. Gemini score: ${score}`);
        } else {
            console.warn("[WORKER] AEO Sync skipped or failed.");
        }
    } catch (err) {
        console.error("[WORKER] AEO Sync failed:", err.message);
    }
}

async function runAllSyncs() {
    console.log("[WORKER] Running manual/initial full sync...");
    await syncSSL();
    await syncReddit();
    await syncNews();
    await syncAEO();
    console.log("[WORKER] Full sync finished.");
}

function startWorkers() {
    console.log("Background Sync Workers Initialized.");

    // Run an initial sync right away so data is live on startup
    runAllSyncs();

    // Cron schedules
    // Run every 30 minutes to stay fresh (Apify safely bypasses rate limits)
    cron.schedule('*/30 * * * *', async () => {
        console.log("[WORKER] Triggering 30-min interval sync...");
        await syncReddit();
        await syncNews();
    });

    // Run SSL check once a day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log("[WORKER] Triggering midnight SSL sync...");
        await syncSSL();
    });

    // Run AEO eval once a day (it costs API credits, so once a day is good)
    cron.schedule('0 6 * * *', async () => {
        console.log("[WORKER] Triggering daily AEO sync...");
        await syncAEO();
    });
}

module.exports = { startWorkers };
