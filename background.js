let items; // [{keyset: '', key: '', translation: '', className: 'tanker-keyset-key'}]

// start listening for messages from content at the very beginning
chrome.extension.onMessage.addListener(function(message) {
    // the panel is not ready at this moment so we have to store messages from content till it's open
    if (message.type === 'tanker-devtools-items') {
        items = message.data;
    }
});

// listening for panel to be active
chrome.extension.onConnect.addListener(function(port) {
    // send items gathered from DOM in content.js to panel
    port.postMessage({ type: 'tanker-devtools-items', data: items });

    // listen to messages from panel
    port.onMessage.addListener(function(message) {
        // get current open tab in browser
        chrome.tabs.getSelected(null, function(tab) {
            // proxy `message` from panel to content.js
            chrome.tabs.sendMessage(tab.id, message, function(responseFromContent) {
                // it's possible to provide callback in content.js and get it here as `responseFromContent`
            });
        });
    });
});
