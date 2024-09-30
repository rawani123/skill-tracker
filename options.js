document.addEventListener('DOMContentLoaded', () => {
  const trackTimeCheckbox = document.getElementById('trackTime');
  const trackScrollCheckbox = document.getElementById('trackScroll');
  const siteUrlInput = document.getElementById('siteUrl');
  const siteTrackTimeCheckbox = document.getElementById('siteTrackTime');
  const siteTrackScrollCheckbox = document.getElementById('siteTrackScroll');
  const saveOptionsButton = document.getElementById('saveOptions');
  const saveSiteOptionsButton = document.getElementById('saveSiteOptions');

  chrome.storage.local.get(['trackTime', 'trackScroll', 'siteTracking'], (result) => {
    trackTimeCheckbox.checked = result.trackTime !== false;
    trackScrollCheckbox.checked = result.trackScroll !== false;
    
    // Populate site tracking options
    if (result.siteTracking) {
      siteUrlInput.value = Object.keys(result.siteTracking)[0] || '';
      siteTrackTimeCheckbox.checked = result.siteTracking[siteUrlInput.value]?.trackTime || false;
      siteTrackScrollCheckbox.checked = result.siteTracking[siteUrlInput.value]?.trackScroll || false;
    }
  });

  saveOptionsButton.addEventListener('click', () => {
    chrome.storage.local.set({
      trackTime: trackTimeCheckbox.checked,
      trackScroll: trackScrollCheckbox.checked
    });
  });

  saveSiteOptionsButton.addEventListener('click', () => {
    const url = siteUrlInput.value;
    const trackTime = siteTrackTimeCheckbox.checked;
    const trackScroll = siteTrackScrollCheckbox.checked;

    chrome.storage.local.get(['siteTracking'], (result) => {
      const siteTracking = result.siteTracking || {};
      siteTracking[url] = {
        trackTime,
        trackScroll
      };
      chrome.storage.local.set({ siteTracking });
    });
  });
});
