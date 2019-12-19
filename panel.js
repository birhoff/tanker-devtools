// TODO: get from panel
const tankerId = 'serp-web4';
const branch = 'master';

// w - reference to panel window object
function callback(w) {
    const body = w.document.body;
    const port = chrome.extension.connect({ name: 'tanker-devtools-port' });

    port.onMessage.addListener(function(message) {
        if (message.type !== 'tanker-devtools-items') return;

        body.addEventListener('mouseover', function(e) {
            if (e.target.tagName === 'A') {
                port.postMessage({
                    type: 'tanker-devtools-select-item',
                    data: e.target.getAttribute('data-className')
                }, function(responseFromBackground) {});
            }
        }, false);

        body.innerHTML = message.data.map(item => `
            <a
                data-className="${item.className}"
                href="https://tanker.yandex-team.ru/?project=${tankerId}&branch=${branch}&keyset=${item.keyset}&key=${item.key}"
                target=_blank
            >${item.translation}</a>
        `).join('<br>');
    });
}

chrome.devtools.panels.create(
    'TankerInspector', // title for the panel tab
    '', // you can specify here path to an icon
    'index.html', // html page which is gonna be injecting into the tab's content
    function(panel) {
        panel.onShown.addListener(callback);
        // panel.onSearch.addListener(callback);
    }
);
