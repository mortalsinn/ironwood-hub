const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

// Initialize the client using the credentials file
const credentialsPath = path.join(__dirname, 'google-credentials.json');
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: credentialsPath,
});

/**
 * Fetches metrics from Google Analytics 4
 * @param {string} propertyId The GA4 Property ID
 * @returns {Promise<Object>} Formatted metrics
 */
async function getGA4Metrics(propertyId) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' }
      ],
    });

    // Also try to get form submits if possible (we'll query for specific events)
    const [eventsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
    });

    // Parse main metrics
    let sessions = 0;
    let pageViews = 0;
    let avgSessionDuration = 0;

    if (response.rows && response.rows.length > 0) {
      const metricValues = response.rows[0].metricValues;
      sessions = parseInt(metricValues[0].value, 10);
      pageViews = parseInt(metricValues[1].value, 10);
      avgSessionDuration = parseFloat(metricValues[2].value);
    }

    // Parse form events
    let formSubmits = 0;
    if (eventsResponse.rows && eventsResponse.rows.length > 0) {
      eventsResponse.rows.forEach(row => {
        const eventName = row.dimensionValues[0].value.toLowerCase();
        const eventCount = parseInt(row.metricValues[0].value, 10);
        // Look for common lead generation event names
        if (eventName.includes('form_submit') || eventName.includes('generate_lead') || eventName.includes('contact')) {
          formSubmits += eventCount;
        }
      });
    }

    // Format for display
    const formatNumber = (num) => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toLocaleString();
    };

    const formatDuration = (seconds) => {
      if (!seconds) return '0s';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    return {
      sessions: formatNumber(sessions),
      pageViews: formatNumber(pageViews),
      formSubmits: formSubmits,
      avgEngagement: formatDuration(avgSessionDuration)
    };
  } catch (error) {
    console.error('Failed to fetch from GA4:', error);
    return null;
  }
}

module.exports = {
  getGA4Metrics
};
