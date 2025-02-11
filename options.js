document.addEventListener("DOMContentLoaded", () => {
    const siteInput = document.getElementById("siteInput");
    const addSiteButton = document.getElementById("addSite");
    const blockedSitesList = document.getElementById("blockedSites");
    const excludedSitesList = document.getElementById("excludedSites");

    function loadSites() {
        browser.storage.sync.get({ blockedSites: [], excludedSites: [] }, (data) => {
            blockedSitesList.innerHTML = "";
            excludedSitesList.innerHTML = "";

            // 禁止サイトリストを表示
            data.blockedSites.forEach((site, index) => {
                const listItem = document.createElement("li");
                listItem.className = "site-item";
                listItem.innerHTML = `${site} 
                    <button data-index="${index}" data-type="exclude">一時除外</button>`;
                blockedSitesList.appendChild(listItem);
            });

            // 一時除外リストを表示
            data.excludedSites.forEach((site, index) => {
                const listItem = document.createElement("li");
                listItem.className = "site-item";
                listItem.innerHTML = `${site} 
                    <button data-index="${index}" data-type="restore">追加</button>`;
                excludedSitesList.appendChild(listItem);
            });
        });
    }

    // サイトを追加
    addSiteButton.addEventListener("click", () => {
        const site = siteInput.value.trim();
        if (site) {
            browser.storage.sync.get({ blockedSites: [] }, (data) => {
                const newSites = [...data.blockedSites, site];
                browser.storage.sync.set({ blockedSites: newSites }, loadSites);
            });
        }
        siteInput.value = "";
    });

    // サイトの除外・追加を処理
    document.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const index = event.target.dataset.index;
            const type = event.target.dataset.type;

            browser.storage.sync.get({ blockedSites: [], excludedSites: [] }, (data) => {
                if (type === "exclude") {
                    // 禁止サイトから削除し、一時除外リストに追加
                    const site = data.blockedSites.splice(index, 1)[0];
                    data.excludedSites.push(site);
                } else if (type === "restore") {
                    // 一時除外リストから削除し、禁止サイトリストに追加
                    const site = data.excludedSites.splice(index, 1)[0];
                    data.blockedSites.push(site);
                }

                // ストレージを更新
                browser.storage.sync.set({ 
                    blockedSites: data.blockedSites, 
                    excludedSites: data.excludedSites 
                }, loadSites);
            });
        }
    });

    loadSites();
});
