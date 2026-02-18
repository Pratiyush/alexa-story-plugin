// Utility for retrieving latest story metadata from S3 or a test override.
const fetch = require("node-fetch");

async function fetchLatestStory(bucket, key) {
  // In tests, allow bypassing the network by using an environment override.
  if (process.env.TEST_LATEST_STORY_JSON) {
    return JSON.parse(process.env.TEST_LATEST_STORY_JSON);
  }

  const url = `https://${bucket}.s3.amazonaws.com/${key}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch latest story metadata");
  }
  const data = await response.json();
  return data;
}

module.exports = {
  fetchLatestStory
};
