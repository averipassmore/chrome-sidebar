import { useEffect, useState } from 'react';

const App = () => {
  const [tabs, setTabs] = useState<string[]>([]);
  
  const fetchUrls = async () => {
    // leverages the existing event listener in the useEffect
    await chrome.runtime.sendMessage({
      type: 'GIVE_ME_TABS',
    });
  };

  const handleStorageChange = (message:any) => {
    if (message.type === 'STORAGE_UPDATED') {
      setTabs(message.data);
    }
  };

  useEffect(() => {
    fetchUrls(); 
    chrome.runtime.onMessage.addListener(handleStorageChange);

    return () => {
      chrome.runtime.onMessage.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <main>
      <p>Hello Gwen Here are your tabs!</p>
      <ol>
        {tabs?.map((tab, i) => {
          return (
            <li key={i}>{tab}</li>
          )
        })}
      </ol>
    </main>
  )
}

export default App;
