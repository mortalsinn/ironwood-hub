const cron = require('node-cron');
const { db } = require('../database');

function startWorkers() {
    console.log("Background Sync Workers Initialized.");

    // Run every 4 hours
    cron.schedule('0 */4 * * *', () => {
        console.log("[WORKER] Syncing Reddit Leads & News...");
        // MOCK: in reality, we'd call Reddit API and insert into db.
        // For now, we simulate a successful job.
        console.log("[WORKER] Reddit & News sync complete.");
    });

    // Run daily at midnight
    cron.schedule('0 0 * * *', () => {
        console.log("[WORKER] Syncing SERP Competitors and Search Trends...");
        console.log("[WORKER] Syncing AEO Matrix...");
        console.log("[WORKER] Sync complete.");
    });
}

module.exports = { startWorkers };
