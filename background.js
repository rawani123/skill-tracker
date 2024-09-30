chrome.webNavigation.onCompleted.addListener((details) => {
  const url = new URL(details.url).hostname;
  chrome.storage.local.get(['activity'], (result) => {
    const activity = result.activity || {};
    if (!activity[url]) {
      activity[url] = {
        visits: 0,
        timeSpent: 0,
        scrollDepth: 0,
        clicks: 0 // Initialize clicks
      };
    }
    activity[url].visits += 1;
    chrome.storage.local.set({ activity });
  });
}, { url: [{ hostContains: '' }] });

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'trackTime') {
    chrome.storage.local.get(['activity'], (result) => {
      const activity = result.activity || {};
      const url = new URL(sender.url).hostname;
      if (!activity[url]) {
        activity[url] = { visits: 0, timeSpent: 0, scrollDepth: 0, clicks: 0 };
      }
      activity[url].timeSpent += message.timeSpent || 0;
      chrome.storage.local.set({ activity });
    });
  }

  if (message.action === 'trackScroll') {
    chrome.storage.local.get(['activity'], (result) => {
      const activity = result.activity || {};
      const url = new URL(sender.url).hostname;
      if (!activity[url]) {
        activity[url] = { visits: 0, timeSpent: 0, scrollDepth: 0, clicks: 0 };
      }
      activity[url].scrollDepth = Math.max(activity[url].scrollDepth, message.scrollDepth || 0);
      chrome.storage.local.set({ activity });
    });
  }

  if (message.action === 'trackClick') {
    chrome.storage.local.get(['activity'], (result) => {
      const activity = result.activity || {};
      const url = new URL(sender.url).hostname;
      if (!activity[url]) {
        activity[url] = { visits: 0, timeSpent: 0, scrollDepth: 0, clicks: 0 };
      }
      activity[url].clicks += 1; // Increment clicks
      chrome.storage.local.set({ activity });
    });
  }

  if (message.action === 'detectedSkills') {
    chrome.storage.local.get(['skills'], (result) => {
      const skills = result.skills || {};
      const detectedSkills = message.skills;
      for (const tech in detectedSkills) {
        skills[tech] = (skills[tech] || 0) + detectedSkills[tech];
      }
      chrome.storage.local.set({ skills });
    });
  }
});
