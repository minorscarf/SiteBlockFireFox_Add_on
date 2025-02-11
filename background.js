// ユーザーが禁止サイトにアクセスしたらタブを閉じる
browser.webNavigation.onCommitted.addListener((details) => {
  browser.storage.sync.get({ blockedSites: [], excludedSites: [] }, (data) => {
      // 一時除外リストにあるサイトは無視
      if (data.excludedSites.some(site => details.url.includes(site))) {
          return;
      }

      // 禁止リストにあるサイトならタブを閉じる
      if (data.blockedSites.some(site => details.url.includes(site))) {
        browser.tabs.remove(details.tabId);
      }
  });
}, { url: [{ urlMatches: ".*" }] });

browser.browserAction.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});