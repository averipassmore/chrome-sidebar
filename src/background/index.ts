chrome.webNavigation.onCompleted.addListener(async (e) => {
  if (e?.frameId === 0) {
    const tabs = await getTabsFromStorage();

    // ensure last tab is not the same as the next tab
    if (tabs[tabs.length - 1] !== e?.url) {
      await chrome.storage.local.set({ "tabs": [...tabs.tabs, e?.url]})
    }
  };
})

const getTabsFromStorage = async () => {
  const tabs = await chrome.storage.local.get(["tabs"])
  if (tabs?.tabs) return tabs;
  else return {"tabs": []};
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'GIVE_ME_TABS') {
    const tabs = await getTabsFromStorage();
    chrome.runtime.sendMessage({
      type: 'STORAGE_UPDATED',
      data: tabs.tabs
    });
  }
})


interface StorageChanges {
  [key: string]: chrome.storage.StorageChange;
}

const handleStorageChange = (changes:StorageChanges, areaName:chrome.storage.AreaName) => {
  if (chrome.runtime.lastError) {
    console.error("Error sending message:", chrome.runtime.lastError);
  } else {
    if (areaName === "local" && changes?.tabs) {
      chrome.runtime.sendMessage({
        type: 'STORAGE_UPDATED',
        data: changes.tabs.newValue,
      });
    }
  } 
};

chrome.storage.onChanged.addListener(handleStorageChange)


