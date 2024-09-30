let startTime = Date.now();

// Track time spent on the page
window.addEventListener('beforeunload', () => {
  const timeSpent = (Date.now() - startTime) / 1000; // Time in seconds
  try {
    chrome.runtime.sendMessage({ action: 'trackTime', timeSpent });
  } catch (error) {
    console.error("Error sending time spent message:", error);
  }
});

// Track scroll depth on the page
window.addEventListener('scroll', () => {
  const scrollDepth = window.scrollY + window.innerHeight;
  const documentHeight = document.body.scrollHeight;

  if (scrollDepth >= documentHeight) {
    // Reached the bottom of the page
    try {
      chrome.runtime.sendMessage({ action: 'trackScroll', scrollDepth });
    } catch (error) {
      console.error("Error sending scroll depth message:", error);
    }
  }
});

// Track clicks on the page
document.addEventListener('click', () => {
  try {
    chrome.runtime.sendMessage({ action: 'trackClick' });
  } catch (error) {
    console.error("Error sending click message:", error);
  }
});

// Detect technologies on page load
document.addEventListener('DOMContentLoaded', () => {
  detectTechnologies();
});

function detectTechnologies() {
  const pageContent = document.body ? document.body.innerText : '';
  const knownTechnologies = ['JavaScript', 'React', 'Python', 'Node.js'];
  const detectedSkills = {};

  knownTechnologies.forEach((tech) => {
    if (new RegExp(`\\b${tech}\\b`, 'i').test(pageContent)) {
      detectedSkills[tech] = (detectedSkills[tech] || 0) + 1;
    }
  });

  console.log("Detected skills:", detectedSkills);
  try {
    chrome.runtime.sendMessage({ action: 'detectedSkills', skills: detectedSkills });
  } catch (error) {
    console.error("Error sending detected skills message:", error);
  }
}
