browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browser.tabs.create({
      url: 'https://github.com/shokh/snipy',
    });
  }
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyText') {
    navigator.clipboard.writeText(request.text).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});
